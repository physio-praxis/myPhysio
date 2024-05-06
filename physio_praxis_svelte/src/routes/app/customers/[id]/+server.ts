import { error as svelte_error } from '@sveltejs/kit';

export async function DELETE(event) {
	const {
		locals: { supabase }
	} = event;

	const { id } = event.params;

	const { error } = await supabase.from('customer').delete().eq('customer_id', id);

	if (error) {
		return svelte_error(500, error.message);
	}

	return new Response(null, {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
