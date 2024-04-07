import type { CustomerPetOverview } from '$lib/types/gen/types';
import { error as svelte_error } from '@sveltejs/kit';

export const load = async ({ locals: { supabase } }) => {
	const { data, error } = await supabase.from('customer_pet_overview').select('*');
	if (error) {
		svelte_error(500, error.message);
	}
	return {
		customerPetOverview: data as CustomerPetOverview[]
	};
};
