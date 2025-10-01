import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email('Ungültige E-Mail-Adresse.'),
	password: z.string().min(5, 'Ungültiges Passwort.')
});

export const load = async () => {
	const form = superValidate(zod(schema));
	return { form: await form };
};

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		if (error || !data.user.email) {
			return setError(form, 'email', 'Ungültige Anmeldeinformationen!');
		}

		return redirect(303, '/app/calendar');
	}
} satisfies Actions;
