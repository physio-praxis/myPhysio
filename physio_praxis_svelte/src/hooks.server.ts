import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import type { Database } from '$lib/types/gen/supabase';

export const handle: Handle = async ({ event, resolve }) => {
	// this will make the supabase client available to api routes, server layout loads and form actions.
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get: (key) => event.cookies.get(key),
				set: (key, value, options) => {
					event.cookies.set(key, value, { ...options, path: '/' });
				},
				remove: (key, options) => {
					event.cookies.delete(key, { ...options, path: '/' });
				}
			}
		}
	);

	// helper to call `await getSession()` instead of calling `const { data: { session } } = await supabase.auth.getSession()`
	event.locals.getSession = async () => {
		const { data: getUserData } = await event.locals.supabase.auth.getUser();
		let {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		// this will revalidate session data on every client call
		if (getUserData.user == null) {
			session = null;
		}
		return session;
	};

	if (event.url.pathname.startsWith('/app') && event.request.method === 'GET') {
		const session = await event.locals.getSession();

		if (!session || !session.user.email) {
			return redirect(303, '/auth/login');
		}
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
