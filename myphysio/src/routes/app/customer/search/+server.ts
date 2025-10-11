import { db } from '$lib/server/db/db';
import { customerSearchView } from '$lib/server/db/schema';
import type { CustomerSearchResponse } from '$lib/types/customerTypes';
import { decodeCursor, encodeCursor } from '$lib/utils/cursor';
import { customerSearchQuerySchema } from '$lib/validation/app/customer/customerSearch.schema';
import { error, type RequestHandler } from '@sveltejs/kit';
import { desc, SQL, sql } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	const parsed = customerSearchQuerySchema.safeParse(Object.fromEntries(url.searchParams));
	if (!parsed.success) {
		throw error(400, { message: `Invalid query, error: ${parsed.error.flatten()}` });
	}

	const { query: queryInput, limit: limitStr, cursor } = parsed.data;
	const limit = Number(limitStr);
	const query = queryInput.trim() ?? '';
	const queryLike = `%${query}%`;

	let cursorClause = sql`TRUE`;
	if (cursor) {
		const c = decodeCursor(cursor);
		// Get rows where (created_at, customer_id) comes before the given (created_at, id) pair for pagaination
		cursorClause = sql`(${customerSearchView.createdAt}, ${customerSearchView.customerId}) < (${c.createdAt}, ${c.id})`;
	}

	const whereClause = query.length > 0 ? buildILikeQuery(queryLike, cursorClause) : cursorClause;

	const rows = await db
		.select({
			customerId: customerSearchView.customerId,
			createdAt: customerSearchView.createdAt,
			name: customerSearchView.name,
			email: customerSearchView.email,
			phoneNumber: customerSearchView.phoneNumber,
			address: customerSearchView.address,
			petsLine: customerSearchView.petsLine,
			hasConsent: customerSearchView.hasConsent
		})
		.from(customerSearchView)
		.where(whereClause)
		.orderBy(desc(customerSearchView.createdAt), desc(customerSearchView.customerId))
		.limit(limit + 1); // fetch one more to indicate there are more results without using COUNT

	const hasMoreRows = rows.length > limit;
	const page = hasMoreRows ? rows.slice(0, limit) : rows;

	const items = page.map((c) => ({
		customer: {
			customerId: c.customerId,
			createdAt: c.createdAt,
			name: c.name,
			email: c.email,
			phoneNumber: c.phoneNumber,
			address: c.address
		},
		petsLine: c.petsLine,
		badges: { hasConcent: c.hasConsent }
	}));

	const lastRow = page.at(-1);
	const nextCursor =
		hasMoreRows && lastRow ? encodeCursor(lastRow.customerId, lastRow.createdAt) : undefined;

	const payload: CustomerSearchResponse = { items, nextCursor };
	return new Response(JSON.stringify(payload), { status: 200 });
};

function buildILikeQuery(query: string, cursorClause: SQL<unknown>) {
	return sql`(
        ${customerSearchView.name} ILIKE ${query}
        OR ${customerSearchView.email} ILIKE ${query}
        OR ${customerSearchView.phoneNumber} ILIKE ${query}
        OR ${customerSearchView.address} ILIKE ${query}
        OR ${customerSearchView.petsText} ILIKE ${query}
    ) AND ${cursorClause}`;
}
