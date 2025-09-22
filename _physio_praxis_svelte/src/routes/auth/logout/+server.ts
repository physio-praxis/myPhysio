import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const { supabase } = event.locals;
	const { error } = await supabase.auth.signOut();
	if (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
	return new Response(null, {
		status: 302,
		headers: {
			location: '/auth/login'
		}
	});
};
