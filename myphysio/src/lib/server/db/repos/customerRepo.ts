import { customer, customerConsent, type InsertCustomer } from '../schema';
import { db } from '../db';
import { createHash, randomUUID } from 'node:crypto';
import { supabaseAdmin } from '$lib/server/supabase';

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
}

export async function saveConsentFile({ customerId, file }: SaveConsentFileArgs) {
	const buffer = Buffer.from(await file.arrayBuffer());
	const sha256Hex = createHash('sha256').update(buffer).digest('hex');
	
	const storageBucket = 'customer-consents';
	const storageKey = `${customerId}/${randomUUID()}-${file.name}`;

	await uploadToStorage(storageBucket, storageKey, buffer, file.type);

	await db.insert(customerConsent).values({
		customerId,
		storageBucket,
		storageKey,
		filename: file.name,
		mimeType: file.type,
		sizeBytes: file.size,
		sha256Hex,
		uploadedAt: new Date(),
		isLatest: true
	}).execute();
}