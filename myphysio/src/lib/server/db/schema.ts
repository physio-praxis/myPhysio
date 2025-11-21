import { and, eq, relations, sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import {
	pgTable,
	text,
	uuid,
	timestamp,
	serial,
	integer,
	date,
	index,
	boolean,
	pgView,
	numeric,
	varchar
} from 'drizzle-orm/pg-core';

// ---------------------- Auth Tables ----------------------------
/** Auth User */
export const authUser = pgTable('auth_user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	supabaseUserId: uuid('supabase_user_id').unique()
});
export type InsertAuthUser = InferInsertModel<typeof authUser>;
export type SelectAuthUser = InferSelectModel<typeof authUser>;

/** UserSession */
export const userSession = pgTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => authUser.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});
export type InsertUserSession = InferInsertModel<typeof userSession>;
export type SelectUserSession = InferSelectModel<typeof userSession>;

// ---------------------- Tables ----------------------------
/** Customer */
export const customer = pgTable(
	'customer',
	{
		customerId: serial('customer_id').primaryKey(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
		firstName: text('first_name').notNull(),
		lastName: text('last_name').notNull(),
		email: text('email').notNull().unique(),
		phoneNumber: text('phone_number').notNull().unique(),
		street: text('street').notNull(),
		additionalAddress: text('additional_address'),
		postalCode: text('postalCode').notNull(),
		city: text('city').notNull(),
		country: text('country').notNull()
	},
	(t) => ({
		ixCustomerCreatedId: index('ix_customer_created_id').on(t.createdAt, t.customerId),
		ixCustomerFirstName: index('ix_customer_first_name').on(t.firstName),
		ixCustomerLastName: index('ix_customer_last_name').on(t.lastName),
		ixCustomerEmail: index('ix_customer_email').on(t.email),
		ixCustomerPhone: index('ix_customer_phone').on(t.phoneNumber),
		ixCustomerCity: index('ix_customer_city').on(t.city),
		ixCustomerStreet: index('ix_customer_street').on(t.street)
	})
);
export type InsertCustomer = InferInsertModel<typeof customer>;
export type SelectCustomer = InferSelectModel<typeof customer>;

/** Customer Concent (DSGVO files) */
export const customerConsent = pgTable('customer_consent', {
	id: serial('id').primaryKey(),
	customerId: integer('customer_id')
		.notNull()
		.unique()
		.references(() => customer.customerId, { onDelete: 'cascade' }),
	storageBucket: text('storage_bucket').notNull(),
	storageKey: text('storage_key').notNull(),
	filename: text('filename').notNull(),
	mimeType: text('mime_type').notNull(),
	sizeBytes: integer('size_bytes').notNull(),
	sha256Hex: text('sha256_hex').notNull(),
	isLatest: boolean('is_latest').notNull().default(true),
	uploadedAt: timestamp('uploaded_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});
export type InsertCustomerConsent = InferInsertModel<typeof customerConsent>;
export type SelectCustomerConsent = InferSelectModel<typeof customerConsent>;

/** Species */
export const species = pgTable(
	'species',
	{
		speciesId: serial('species_id').primaryKey(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
		name: text('name').unique().notNull()
	},
	(t) => ({
		ixSpeciesName: index('ix_species_name').on(t.name)
	})
);
export type InsertSpecies = InferInsertModel<typeof species>;
export type SelectSpecies = InferSelectModel<typeof species>;

/** Pet */
export const pet = pgTable(
	'pet',
	{
		petId: serial('pet_id').primaryKey(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
		name: text('name').notNull(),
		speciesId: integer('species_id').references(() => species.speciesId, { onDelete: 'set null' }),
		breed: text('breed').notNull(),
		birthdate: date('birthdate', { mode: 'date' }),
		medicalHistory: text('medical_history'),
		customerId: integer('customer_id').references(() => customer.customerId, {
			onDelete: 'cascade'
		})
	},
	(t) => ({
		ixPetCustomer: index('ix_pet_customer_id').on(t.customerId),
		ixPetSpecies: index('ix_pet_species_id').on(t.speciesId),
		ixPetName: index('ix_pet_name').on(t.name),
		ixPetBreed: index('ix_pet_breed').on(t.breed)
	})
);
export type InsertPet = InferInsertModel<typeof pet>;
export type SelectPet = InferSelectModel<typeof pet>;

/** Invoice */
export const invoice = pgTable(
	'invoice',
	{
		invoiceId: serial('invoice_id').primaryKey(),
		dateIssued: timestamp('date_issued', { withTimezone: true, mode: 'date' })
			.notNull()
			.defaultNow(),
		amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
		customerId: integer('customer_id')
			.notNull()
			.references(() => customer.customerId, { onDelete: 'restrict', onUpdate: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
	},
	(t) => ({
		idxInvoiceCustomer: index('idx_invoice_customer').on(t.customerId),
		idxInvoiceDate: index('idx_invoice_date').on(t.dateIssued),
		idxInvoiceCustomerDate: index('idx_invoice_customer_date').on(t.customerId, t.dateIssued)
	})
);
export type InsertInvoice = InferInsertModel<typeof invoice>;

/** Treatment */
export const treatment = pgTable('treatment', {
	treatmentId: serial('treatment_id').primaryKey(),
	name: varchar('name', { length: 200 }).notNull(),
	description: text('description').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});
export type InsertTreatment = InferInsertModel<typeof treatment>;

/** Pet Treatment */
export const petTreatment = pgTable(
	'pet_treatment',
	{
		petTreatmentId: serial('pet_treatment_id').primaryKey(),
		petId: integer('pet_id')
			.notNull()
			.references(() => pet.petId, { onDelete: 'cascade', onUpdate: 'cascade' }),
		treatmentId: integer('treatment_id')
			.notNull()
			.references(() => treatment.treatmentId, { onDelete: 'restrict', onUpdate: 'cascade' }),
		invoiceId: integer('invoice_id').references(() => invoice.invoiceId, {
			onDelete: 'set null',
			onUpdate: 'cascade'
		}),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
	},
	(t) => ({
		idxPetTreatment_pet: index('idx_pettreatment_pet').on(t.petId),
		idxPetTreatment_treatment: index('idx_pettreatment_treatment').on(t.treatmentId),
		idxPetTreatment_invoice: index('idx_pettreatment_invoice').on(t.invoiceId)
	})
);
export type InsertPetTreatment = InferInsertModel<typeof petTreatment>;

// ------------------- Relations --------------------
/** Invoice Customer */
export const invoiceRelations = relations(invoice, ({ one }) => ({
	customer: one(customer, {
		fields: [invoice.customerId],
		references: [customer.customerId]
	})
}));

/** Pet Treatment */
export const treatmentRelations = relations(treatment, ({ many }) => ({
	petTreatments: many(petTreatment)
}));

/** Pet Treatment */
export const petTreatmentRelations = relations(petTreatment, ({ one }) => ({
	pet: one(pet, { fields: [petTreatment.petId], references: [pet.petId] }),
	treatment: one(treatment, {
		fields: [petTreatment.treatmentId],
		references: [treatment.treatmentId]
	}),
	invoice: one(invoice, {
		fields: [petTreatment.invoiceId],
		references: [invoice.invoiceId]
	})
}));

// ------------------- Views ------------------------
/** Customer Search */
export const customerSearchView = pgView('customer_search_view')
	.with({ securityInvoker: true })
	.as((queryBuilder) =>
		queryBuilder
			.select({
				customerId: customer.customerId,
				createdAt: customer.createdAt,
				firstName: customer.firstName,
				lastName: customer.lastName,
				email: customer.email,
				phoneNumber: customer.phoneNumber,
				street: customer.street,
				additionalAddress: customer.additionalAddress,
				postalCode: customer.postalCode,
				city: customer.city,
				country: customer.country,
				// UI Line like "Lucky (Hund)"
				petsLine: sql<string>`
					COALESCE(
						STRING_AGG(
							CASE
								WHEN ${pet.petId} IS NULL THEN NULL
								WHEN ${species.name} IS NOT NULL THEN (COALESCE(${pet.name}, '(Ohne Name)') || ' (' || ${species.name} || ')')
								ELSE COALESCE(${pet.name}, '(Ohne Name)')
							END,
							', ' ORDER BY ${pet.petId})
						FILTER (WHERE ${pet.petId} IS NOT NULL),
						'')
					`.as('pets_line'),
				// text blob for pet search (lower case)
				petsText: sql<string>`
					COALESCE(
						STRING_AGG(LOWER(CONCAT_WS(' ', ${pet.name}, ${pet.breed}, ${species.name})), ' ' ORDER BY ${pet.petId})
						FILTER (WHERE ${pet.petId} IS NOT NULL),
						''
					)
				`.as('pets_text'),
				hasConsent: sql<boolean>`
					EXISTS(
						SELECT 1
						FROM ${customerConsent}
						WHERE ${customerConsent.customerId} = ${customer.customerId} AND ${customerConsent.isLatest} = TRUE
					)
				`.as('has_consent')
			})
			.from(customer)
			.leftJoin(pet, eq(pet.customerId, customer.customerId))
			.leftJoin(species, eq(species.speciesId, pet.speciesId))
			.groupBy(
				customer.customerId,
				customer.createdAt,
				customer.firstName,
				customer.lastName,
				customer.email,
				customer.phoneNumber,
				customer.street,
				customer.additionalAddress,
				customer.postalCode,
				customer.city,
				customer.country
			)
	);

/** Customer Details view */
export const customerDetailsView = pgView('customer_details_view')
	.with({ securityInvoker: true })
	.as((qb) =>
		qb
			.select({
				customerId: customer.customerId,
				createdAt: customer.createdAt,
				firstName: customer.firstName,
				lastName: customer.lastName,
				email: customer.email,
				phoneNumber: customer.phoneNumber,
				street: customer.street,
				additionalAddress: customer.additionalAddress,
				postalCode: customer.postalCode,
				city: customer.city,
				country: customer.country,

				hasConsent: sql<boolean>`(${customerConsent.id} IS NOT NULL)`.as('has_consent'),
				consentFilename: customerConsent.filename,
				consentUploadedAt: customerConsent.uploadedAt,

				pets: sql<
					Array<{
						petId: number;
						name: string | null;
						speciesId: number | null;
						species: string | null;
						breed: string | null;
						birthdate: string | null;
						age: string | null;
						medicalHistory: string | null;
					}>
				>`
					COALESCE(
						(
							SELECT jsonb_agg(
								jsonb_build_object(
									'petId', p.pet_id,
									'name', p.name,
									'speciesId', p.species_id,
									'species', s.name,
									'breed', p.breed,
									'birthdate', p.birthdate::text,
									'age', DATE_PART('YEAR',AGE(p.birthdate)),
									'medicalHistory', p.medical_history
								)
								ORDER BY p.created_at DESC, p.pet_id
							)
							FROM public.pet p
							LEFT JOIN public.species s ON s.species_id = p.species_id
							WHERE p.customer_id = ${customer.customerId}
						), '[]'::jsonb
					)
				`.as('pets'),

				last5Treatments: sql<
					Array<{
						petTreatmentId: number;
						createdAt: string;
						petId: number;
						petName: string | null;
						treatmentId: number;
						treatmentName: string;
						invoiceId: number | null;
						invoiceAmount: string | null;
						invoiceDate: string | null;
					}>
				>`
					COALESCE(
						(
							SELECT jsonb_agg(
								jsonb_build_object(
									'petTreatmentId', t5.pet_treatment_id,
									'createdAt', t5.created_at,
									'petId', t5.pet_id,
									'petName', t5.pet_name,
									'treatmentId', t5.treatment_id,
									'treatmentName', t5.treatment_name,
									'invoiceId', t5.invoice_id,
									'invoiceAmount', t5.invoice_amount,
									'invoiceDate', t5.invoice_date
								)
								ORDER BY t5.created_at DESC, t5.pet_treatment_id
							)
							FROM (
								SELECT
									pt.pet_treatment_id AS pet_treatment_id,
									pt.created_at AS created_at,
									pt.pet_id AS pet_id,
									p.name AS pet_name,
									t.treatment_id AS treatment_id,
									t.name AS treatment_name,
									pt.invoice_id AS invoice_id,
									i.amount::text AS invoice_amount,
									i.date_issued AS invoice_date
								FROM public.pet_treatment pt
								JOIN public.pet p ON p.pet_id = pt.pet_id
								JOIN public.treatment t ON t.treatment_id = pt.treatment_id
								LEFT JOIN public.invoice i ON i.invoice_id = pt.invoice_id
								WHERE p.customer_id = ${customer.customerId}
								ORDER BY pt.created_at DESC, pt.pet_treatment_id DESC
								LIMIT 5
							) AS t5
						), '[]'::jsonb
					)
				`.as('last5_treatments')
			})
			.from(customer)
			.leftJoin(
				customerConsent,
				and(
					eq(customerConsent.customerId, customer.customerId),
					sql`(${customerConsent.isLatest}) = TRUE`
				)
			)
	);
