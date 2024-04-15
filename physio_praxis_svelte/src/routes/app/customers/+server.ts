import type { CustomerPetOverview } from '$lib/types/types.js';
import { error as svelte_error } from '@sveltejs/kit';

export async function GET(event) {
	const {
		locals: { supabase }
	} = event;
	const { data, error } = await supabase.from('customer_pet_overview').select('*');
	if (error) {
		return svelte_error(500, error.message);
	}
	return new Response(JSON.stringify(data as CustomerPetOverview[]), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
