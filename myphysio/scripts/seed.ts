import { z } from 'zod';
import { Command } from 'commander';
import { env } from 'node:process';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql, desc } from 'drizzle-orm';
import { faker } from '@faker-js/faker';
import {
	customer,
	customerConsent,
	invoice,
	pet,
	petTreatment,
	species,
	treatment,
	type InsertCustomer,
	type InsertInvoice,
	type InsertPet,
	type InsertPetTreatment,
	type InsertSpecies,
	type InsertTreatment
} from '$lib/server/db/schema';
import { createHash, randomUUID } from 'node:crypto';
import 'dotenv/config';

type DB = NodePgDatabase;

const ArgSchema = z.object({
	customers: z.coerce.number().int().min(1).max(1000).default(50),
	maxPets: z.coerce.number().int().min(0).max(10).default(3),
	wipe: z.boolean().default(false),
	withFiles: z.coerce.boolean().default(false),
	filesPer: z.coerce.number().int().min(1).max(10).default(5),
	speciesCount: z.coerce.number().int().min(1).max(50).default(10),
	treatmentsCount: z.coerce.number().int().min(3).max(10).default(5),
	avgInvoices: z.coerce.number().int().min(0).max(10).default(2),
	avgPetTreatmentsPerPet: z.coerce.number().int().min(0).max(10).default(2)
});

function parseArgs() {
	const program = new Command()
		.name('seed')
		.description('Seed mock data for MyPhisio')
		.option('--customers <n>', 'number of customers (1..100)', '50')
		.option('--maxPets <n>', 'max pets per customer (0..10)', '3')
		.option('--withFiles', 'also attach consent files to some customers', true)
		.option('--filesPer <n>', 'how many customers get a file (1..10) (default 5)', '5')
		.option('--speciesCount <n>', 'how many species (1..50) (default 10)', '10')
		.option('--wipe', 'wipe tables before seeding', false)
		.option('--treatmentsCount <n>', 'how many treatment types (3..10) (default 5)', '5')
		.option('--avgInvoices <n>', 'avg invoices per customer (0..10) (default 2)', '2')
		.option('--avgPetTreatmentsPerPet <n>', 'avg pet_treatments per pet (0..10) (default 2)', '2')
		.showHelpAfterError(true)
		.addHelpText(
			'after',
			`
Examples:
  pnpm db:seed
  pnpm db:seed --customers 50 --speciesCount 10 --maxPets 3 --filesPer 5 --withFiles --wipe
  pnpm db:seed --treatmentsCount 12 --avgInvoices 3 --avgPetTreatmentsPerPet 2
  pnpm db:seed --wipe
            `
		);

	program.parse();
	const opts = program.opts();
	return ArgSchema.parse({
		customers: opts.customers,
		speciesCount: opts.speciesCount,
		maxPets: opts.maxPets,
		wipe: opts.wipe,
		withFiles: opts.withFiles,
		filesPer: opts.filesPer,
		treatmentsCount: opts.treatmentsCount,
		avgInvoices: opts.avgInvoices,
		avgPetTreatmentsPerPet: opts.avgPetTreatmentsPerPet
	});
}

function getDbUrl() {
	const url = env.DATABASE_URL;
	if (!url) {
		console.error('DATABASE_URL is missing. Add it to .env');
		process.exit(1);
	}
	if (env.NODE_ENV === 'production') {
		console.error('Refusing to seed with NODE_ENV=production. are you crazy?!');
		process.exit(1);
	}
	return url;
}

function getSupabaseAdmin(): SupabaseClient<unknown> | null {
	const url = env.PUBLIC_SUPABASE_URL;
	const key = env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !key) return null;
	return createClient(url, key, { auth: { persistSession: false } });
}

function buildConsentFileContents(customerFirstName: string, customerLastName: string) {
	const content = `DSGVO/Einwilligung – Kunde: ${customerFirstName} ${customerLastName}
Ich bestätige, dass ich die Datenschutzbestimmungen gelesen habe und einverstanden bin.
Datum: ${new Date().toISOString().slice(0, 10)}
(Seed/Test-file)
`;
	const buffer = Buffer.from(content, 'utf8');
	return {
		buffer,
		filename: 'consent.txt',
		mime: 'text/plain' as const
	};
}

async function wipeConsentFilesFromStorage(db: DB, supabaseAdmin: SupabaseClient<unknown> | null) {
	if (!supabaseAdmin) {
		console.warn('No Supabase admin client available; skipping Storage wipe.');
		return;
	}

	let rows: { storageBucket: string; storageKey: string }[] = [];
	try {
		rows = await db
			.select({
				storageBucket: customerConsent.storageBucket,
				storageKey: customerConsent.storageKey
			})
			.from(customerConsent);
	} catch {
		console.warn(
			' Could not read customer_consent (maybe not created yet). Skipping Storage wipe.'
		);
		return;
	}

	if (!rows.length) {
		console.log('No consent files referenced; nothing to delete from Storage.');
		return;
	}

	const byBucket = new Map<string, string[]>();
	for (const row of rows) {
		const arr = byBucket.get(row.storageBucket) ?? [];
		arr.push(row.storageKey);
		byBucket.set(row.storageBucket, arr);
	}

	let total = 0;
	for (const [bucket, keys] of byBucket) {
		console.log(`Deleting ${keys.length} object(s) from bucket "${bucket}"…`);
		// delete in chunks (100 at a time)
		for (let i = 0; i < keys.length; i += 100) {
			const chunk = keys.slice(i, i + 100);
			const { error } = await supabaseAdmin.storage.from(bucket).remove(chunk);
			if (error) {
				console.warn(`Failed to delete some objects in "${bucket}": ${error.message}`);
			} else {
				total += chunk.length;
			}
		}
	}
	console.log(`Storage wipe complete. Deleted ${total} object(s).`);
}

async function SeedSpecies(db: DB, count: number) {
	console.log(`Inserting ${count} species...`);
	const speciesList = faker.helpers
		.uniqueArray(faker.animal.type, count)
		.map((species) => species.charAt(0).toUpperCase() + species.slice(1));

	const speciesRows: InsertSpecies[] = speciesList.map((name) => ({ name }));
	if (speciesRows.length) await db.insert(species).values(speciesRows);
	return await db.select().from(species);
}

async function SeedCustomers(db: DB, count: number) {
	console.log(`Inserting ${count} customers...`);
	const now = Date.now();
	const customersToInsert: InsertCustomer[] = Array.from({ length: count }, () => ({
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		email: faker.internet.email().toLowerCase(),
		phoneNumber: faker.phone.number(),
		address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
		createdAt: new Date(now - faker.number.int({ min: 0, max: 7_776_000 }) * 1000)
	}));
	await db.insert(customer).values(customersToInsert);
	return await db
		.select()
		.from(customer)
		.orderBy(desc(customer.createdAt), desc(customer.customerId));
}

async function SeedPets(
	db: DB,
	customers: Awaited<ReturnType<typeof SeedCustomers>>,
	species: Awaited<ReturnType<typeof SeedSpecies>>,
	args: ReturnType<typeof parseArgs>
) {
	console.log(`Inserting Pets...`);
	const chunkSize = 2000;
	const petBatch: InsertPet[] = [];

	for (const cus of customers) {
		const numberOfPets = args.maxPets === 0 ? 0 : faker.number.int({ min: 1, max: args.maxPets });
		for (let index = 0; index < numberOfPets; index++) {
			const spec = faker.helpers.arrayElement(species);
			petBatch.push({
				name: faker.animal.petName(),
				speciesId: spec.speciesId,
				breed: `${faker.word.adjective()} ${faker.word.noun()}`,
				age: faker.date.between({ from: '2010-01-01', to: new Date() }),
				medicalHistory:
					faker.helpers.maybe(() => faker.lorem.sentence({ min: 1, max: 3 }), {
						probability: 0.4
					}) ?? null,
				customerId: cus.customerId,
				createdAt: new Date(
					cus.createdAt.getTime() + faker.number.int({ min: 0, max: 86400 }) * 1000
				)
			});
			if (petBatch.length >= chunkSize) {
				await db.insert(pet).values(petBatch);
				petBatch.length = 0;
			}
		}
	}

	if (petBatch.length) {
		await db.insert(pet).values(petBatch);
	}

	return await db.select().from(pet);
}

const sha256Hex = (buf: Buffer) => createHash('sha256').update(buf).digest('hex');

async function SeedConsentFiles(
	db: DB,
	args: ReturnType<typeof parseArgs>,
	supabaseAdmin: SupabaseClient<unknown> | null,
	customers: Awaited<ReturnType<typeof SeedCustomers>>
) {
	if (args.withFiles && supabaseAdmin) {
		const bucket = 'customer-consents';
		const count = Math.min(args.filesPer, customers.length);
		const pick = faker.helpers.shuffle(customers).slice(0, count);

		console.log(`Generating and uploading ${count} consent text file(s)…`);

		for (const cus of pick) {
			const { buffer, filename, mime } = buildConsentFileContents(
				cus.firstName ?? `Customer-${cus.customerId}`,
				cus.lastName ?? ''
			);
			const key = `${cus.customerId}/${randomUUID()}-${filename}`;
			const sha = sha256Hex(buffer);

			const up = await supabaseAdmin.storage
				.from(bucket)
				.upload(key, buffer, { contentType: mime, upsert: false });
			if (up.error) {
				console.warn(`Upload failed for customer ${cus.customerId}: ${up.error.message}`);
				continue;
			}

			await db.insert(customerConsent).values({
				customerId: cus.customerId,
				filename: filename,
				storageBucket: bucket,
				storageKey: key,
				mimeType: mime,
				sizeBytes: buffer.length,
				sha256Hex: sha,
				isLatest: true
			});
		}
	}
}

async function SeedTreatments(db: DB, count: number) {
	console.log(`Inserting ${count} treatments...`);
	const baseNames = [
		'Vaccination',
		'Deworming',
		'Dental Cleaning',
		'General Checkup',
		'X-Ray',
		'Ultrasound',
		'Blood Test',
		'Surgery',
		'Wound Care',
		'Allergy Test',
		'Microchipping',
		'Physiotherapy'
	];

	const list = faker.helpers
		.uniqueArray(
			() =>
				`${faker.helpers.arrayElement(baseNames)} ${faker.helpers.maybe(() => faker.number.int({ min: 1, max: 3 }), { probability: 0.3 }) ?? ''}`,
			count
		)
		.map((name) => name.trim());

	const rows: InsertTreatment[] = list.map((name) => ({
		name,
		description: faker.lorem.sentence({ min: 4, max: 10 }),
		createdAt: new Date()
	}));

	await db.insert(treatment).values(rows);
	return await db.select().from(treatment);
}

async function SeedInvoices(
	db: DB,
	customers: Awaited<ReturnType<typeof SeedCustomers>>,
	avgPerCustomer: number
) {
	console.log(`Inserting invoices (avg ${avgPerCustomer} per customer)...`);

	const batch: InsertInvoice[] = [];
	for (const cus of customers) {
		const numberPerCustomer = faker.number.int({ min: 0, max: Math.max(0, avgPerCustomer * 2) });
		for (let i = 0; i < numberPerCustomer; i++) {
			const issued = faker.date.between({
				from: new Date(Date.now() - 63_072_000_000), // last 2 years
				to: new Date()
			});
			const amount = faker.number.float({ min: 20, max: 400, fractionDigits: 2 }).toFixed(2);
			batch.push({
				customerId: cus.customerId,
				dateIssued: issued,
				amount,
				createdAt: issued
			});
		}
	}

	if (batch.length) await db.insert(invoice).values(batch);
	const all = await db
		.select()
		.from(invoice)
		.orderBy(desc(invoice.dateIssued), desc(invoice.invoiceId));
	const map = new Map<number, typeof all>();
	for (const inv of all) {
		const arr = map.get(inv.customerId) ?? [];
		arr.push(inv);
		map.set(inv.customerId, arr);
	}

	return map;
}

async function SeedPetTreatments(
	db: DB,
	pets: Awaited<ReturnType<typeof SeedPets>>,
	treatments: Awaited<ReturnType<typeof SeedTreatments>>,
	invoicesByCustomer: Map<number, { invoiceId: number; customerId: number }[]>,
	avgPerPet: number
) {
	console.log(`Inserting pet_treatments (avg ${avgPerPet} per pet)...`);
	const chunkSize = 3000;
	const batch: InsertPetTreatment[] = [];

	for (const p of pets) {
		const numberPerPet = faker.number.int({ min: 0, max: Math.max(0, avgPerPet * 2) });
		for (let i = 0; i < numberPerPet; i++) {
			const tr = faker.helpers.arrayElement(treatments);
			const billed = faker.datatype.boolean({ probability: 0.6 });
			let invoiceId: number | null = null;
			if (billed && p.customerId != null) {
				const invs = invoicesByCustomer.get(p.customerId) ?? [];
				if (invs.length) invoiceId = faker.helpers.arrayElement(invs).invoiceId;
			}

			batch.push({
				petId: p.petId,
				treatmentId: tr.treatmentId,
				invoiceId: invoiceId ?? null,
				createdAt: faker.date.between({
					from: new Date(p.createdAt.getTime() - 2_592_000_000), // last 30 days
					to: new Date()
				})
			});

			if (batch.length >= chunkSize) {
				await db.insert(petTreatment).values(batch);
				batch.length = 0;
			}
		}
	}

	if (batch.length) {
		await db.insert(petTreatment).values(batch);
	}
}

async function main() {
	const args = parseArgs();
	const DATABASE_URL = getDbUrl();
	const supabaseAdmin = args.withFiles ? getSupabaseAdmin() : null;

	if (args.withFiles && !supabaseAdmin) {
		console.warn(
			'--withFiles set but PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing. skipping uploads. '
		);
	}

	const pool = new Pool({ connectionString: DATABASE_URL });
	const db = drizzle(pool) as DB;

	if (args.wipe) {
		console.log('Wiping tables...');
		await wipeConsentFilesFromStorage(db, supabaseAdmin);
		await db.execute(
			sql`TRUNCATE TABLE 
			public.pet_treatment, 
			public.invoice, 
			public.treatment, 
			public.customer_consent, 
			public.pet, 
			public.customer, 
			public.species 
		RESTART IDENTITY CASCADE;`
		);
	}

	const species = await SeedSpecies(db, args.speciesCount);
	const customers = await SeedCustomers(db, args.customers);
	const pets = await SeedPets(db, customers, species, args);
	const treatments = await SeedTreatments(db, args.treatmentsCount);
	const invoicesByCustomer = await SeedInvoices(db, customers, args.avgInvoices);
	await SeedPetTreatments(db, pets, treatments, invoicesByCustomer, args.avgPetTreatmentsPerPet);
	await SeedConsentFiles(db, args, supabaseAdmin, customers);
	console.log(`Done Seeding.`);
	await pool.end();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
