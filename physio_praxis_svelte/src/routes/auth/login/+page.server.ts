import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email) {
			return fail(400, { email, missing: true });
		}

		if (!password) {
			// as a precaution, we only return the email back to the page — not the password.
			return fail(400, { email, pass_missing: true });
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (error || !data.user.email) {
			return fail(400, { email, login_failed: true });
		}

		return redirect(303, '/app/calendar');
	}
} satisfies Actions;
