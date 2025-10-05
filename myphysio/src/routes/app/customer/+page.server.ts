import type { CustomerSearchItem, CustomerSearchResponse } from '$lib/types/customerSearch';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const query = url.searchParams.get('query') ?? '';
	const limit = Number(url.searchParams.get('limit') ?? '20');

	const querySearch = new URLSearchParams();
	if (query) querySearch.set('query', query);
	querySearch.set('limit', String(limit));

	const res = await fetch(`/app/customer/search?${querySearch.toString()}`);
	if (!res.ok) {
		return {
			initialItems: [] as CustomerSearchItem[],
			initialCursor: undefined as string | undefined,
			initialQuery: query,
			limit
		};
	}

	const data = (await res.json()) as CustomerSearchResponse;

	return {
		initialItems: data.items,
		initialCursor: data.nextCursor,
		initialQuery: query,
		limit
	};
};
