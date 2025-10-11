import { db } from '$lib/server/db/db';
import { customer, customerConsent } from '$lib/server/db/schema';
import { supabaseAdmin } from '$lib/server/supabase';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { and, desc, eq, sql } from 'drizzle-orm';

const SIGNED_TTL_SEC = 60;

export const GET: RequestHandler = async ({ params }) => {
	const customerId = Number(params.customerId);
	if (Number.isNaN(customerId)) throw error(400, 'Invalid customer Id');

	const [exists] = await db
		.select({ id: customer.customerId })
		.from(customer)
		.where(eq(customer.customerId, customerId))
		.limit(1);
	if (!exists) throw error(404, 'Customer not found');

	const [latestConsent] = await db
		.select({
			bucket: customerConsent.storageBucket,
			key: customerConsent.storageKey,
			filename: customerConsent.filename,
			mime: customerConsent.mimeType
		})
		.from(customerConsent)
		.where(and(eq(customerConsent.customerId, customerId), sql`${customerConsent.isLatest} = TRUE`))
		.orderBy(desc(customerConsent.uploadedAt))
		.limit(1);

	if (!latestConsent) throw error(404, 'No Concent file found');

	// short lived signed URL
	const { data, error: signErr } = await supabaseAdmin.storage
		.from(latestConsent.bucket)
		.createSignedUrl(latestConsent.key, SIGNED_TTL_SEC, { download: latestConsent.filename });

	if (signErr || !data?.signedUrl) {
		throw error(500, 'Failed to create a signed download URL');
	}

	return redirect(302, data.signedUrl);
};
