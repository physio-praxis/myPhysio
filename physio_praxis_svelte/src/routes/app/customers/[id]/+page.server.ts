import type { Customer } from '$lib/types/types.js';
import { error as svelte_error } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase } }) => {
	const { id } = params;
	const customerId = parseInt(id);
	if (Number.isNaN(customerId)) {
		return svelte_error(400, 'Unknown User');
	}

	const { data: customerData, error: customerError } = await supabase
		.from('customer')
		.select('*')
		.eq('customer_id', customerId)
		.single();
	if (customerError) {
		return svelte_error(500, customerError.message);
	}
	const customer = customerData as Customer;

	return { customer: customer };
};
