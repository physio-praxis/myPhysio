import type { Pet } from '$lib/types/types';
import { error as svelte_error } from '@sveltejs/kit';

export async function GET(event) {
	const {
		locals: { supabase },
		params
	} = event;
	const { data: petsData, error: petsError } = await supabase
		.from('pet')
		.select('*')
		.eq('customer_id', params.customer_id);

	if (petsError) {
		return svelte_error(500, petsError.message);
	}
	return new Response(JSON.stringify(petsData as Pet[]), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
