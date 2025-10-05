import { eq, sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
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
	pgView
} from 'drizzle-orm/pg-core';

// ---------------------- Auth Tables ----------------------------
/** Auth User */
export const authUser = pgTable('auth_user', {
	id: text('id').primaryKey(),
	email: text('email'),
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
		name: text('name'),
		email: text('email'),
		phoneNumber: text('phone_number'),
		address: text('address')
	},
	(t) => ({
		ixCustomerCreatedId: index('ix_customer_created_id').on(t.createdAt, t.customerId),
		ixCustomerName: index('ix_customer_name').on(t.name),
		ixCustomerEmail: index('ix_customer_email').on(t.email),
		ixCustomerPhone: index('ix_customer_phone').on(t.phoneNumber)
	})
);
export type InsertCustomer = InferInsertModel<typeof customer>;
export type SelectCustomer = InferSelectModel<typeof customer>;

/** Customer Concent (DSGVO files) */
export const customerConsent = pgTable('customer_consent', {
	id: serial('id').primaryKey(),
	customerId: integer('customer_id')
		.notNull()
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
		name: text('name')
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
		name: text('name'),
		speciesId: integer('species_id').references(() => species.speciesId, { onDelete: 'set null' }),
		breed: text('breed'),
		age: date('age', { mode: 'date' }),
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

// ------------------- Views ------------------------
export const customerSearchView = pgView('customer_search_view')
	.with({ securityInvoker: true })
	.as((queryBuilder) =>
		queryBuilder
			.select({
				customerId: customer.customerId,
				createdAt: customer.createdAt,
				name: customer.name,
				email: customer.email,
				phoneNumber: customer.phoneNumber,
				address: customer.address,
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
				customer.name,
				customer.email,
				customer.phoneNumber,
				customer.address
			)
	);
