import { customer, customerConsent, invoice, type InsertCustomer } from '../schema';
import { db } from '../db';
import { createHash, randomUUID } from 'node:crypto';
import { supabaseAdmin } from '$lib/server/supabase';
import type { UpdateCustomerInput } from '$lib/types/customerTypes';
import { count, eq } from 'drizzle-orm';

type Input = Omit<InsertCustomer, 'customerId' | 'createdAt'>;

export async function createCustomer(input: Input) {
	const now = new Date();

	const [row] = await db
		.insert(customer)
		.values({
			createdAt: now,
			name: input.name,
			email: input.email ?? null,
			phoneNumber: input.phoneNumber ?? null,
			address: input.address ?? null
		})
		.returning();

	return row;
}

export async function updateCustomer(input: UpdateCustomerInput) {
	const { customerId, ...updates } = input;

	const [row] = await db
		.update(customer)
		.set(updates)
		.where(eq(customer.customerId, customerId))
		.returning();

	if (!row) {
		throw new Error('Kunde nicht gefunden');
	}

	return row;
}

export async function deleteCustomer(customerId: number) {
	const [invoiceCount] = await db
		.select({ count: count() })
		.from(invoice)
		.where(eq(invoice.customerId, customerId));

	if (invoiceCount.count > 0) {
		throw new Error('Kunde kann nicht gelöscht werden, da Rechnungen existieren');
	}

	const consentFiles = await db
		.select({
			storageBucket: customerConsent.storageBucket,
			storageKey: customerConsent.storageKey
		})
		.from(customerConsent)
		.where(eq(customerConsent.customerId, customerId));

	await db.delete(customer).where(eq(customer.customerId, customerId));

	for (const file of consentFiles) {
		await supabaseAdmin.storage.from(file.storageBucket).remove([file.storageKey]);
	}
}

async function uploadToStorage(
	bucket: string,
	key: string,
	bytes: Buffer,
	contentType: string,
	cacheSeconds = 31536000 // 1 year
): Promise<void> {
	const { error } = await supabaseAdmin.storage.from(bucket).upload(key, bytes, {
		contentType,
		upsert: false,
		cacheControl: `public, max-age=${cacheSeconds}, immutable`
	});
	if (error) throw new Error(`Supabase upload failed: ${error.message}`);
}

type SaveConsentFileArgs = {
	customerId: number;
	file: File;
};

export async function saveConsentFile({ customerId, file }: SaveConsentFileArgs) {
	const buffer = Buffer.from(await file.arrayBuffer());
	const sha256Hex = createHash('sha256').update(buffer).digest('hex');

	const storageBucket = 'customer-consents';
	const storageKey = `${customerId}/${randomUUID()}-${file.name}`;

	await uploadToStorage(storageBucket, storageKey, buffer, file.type);

	await db
		.insert(customerConsent)
		.values({
			customerId,
			storageBucket,
			storageKey,
			filename: file.name,
			mimeType: file.type,
			sizeBytes: file.size,
			sha256Hex,
			uploadedAt: new Date(),
			isLatest: true
		})
		.execute();
}
