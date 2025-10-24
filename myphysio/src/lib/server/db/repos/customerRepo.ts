import { customer, type InsertCustomer } from '../schema';
import { db } from '../db';

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
