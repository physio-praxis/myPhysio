import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const authUser = pgTable('auth_user', {
	id: text('id').primaryKey(),
	email: text('email'),
	supabaseUserId: uuid('supabase_user_id').unique()
});
export type InsertAuthUser = InferInsertModel<typeof authUser>;
export type SelectAuthUser = InferSelectModel<typeof authUser>;

export const userSession = pgTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => authUser.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});
export type InsertUserSession = InferInsertModel<typeof userSession>;
export type SelectUserSession = InferSelectModel<typeof userSession>;
