import { z } from 'zod';
import validator from 'validator';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, type Actions, redirect, error as svelteError } from '@sveltejs/kit';
import type { CustomerInsert } from '$lib/types/types';

const schema = z.object({
	firstName: z.string().min(2, 'Vorname sollte mindestens 2 Zeichen lang sein.'),
	lastName: z.string().min(2, 'Nachname sollte mindestens 2 Zeichen lang sein.'),
	phoneNumber: z
		.string()
		.refine((value) => validator.isMobilePhone(value), {
			message: 'Ungültige Telefonnummer.'
		})
		.optional(),
	email: z.string().email('Ungültige E-Mail-Adresse.').optional(),
	address: z.string().optional()
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

		const customer = {
			name: `${form.data.firstName} ${form.data.lastName}`,
			phone_number: form.data.phoneNumber,
			email: form.data.email,
			address: form.data.address
		} satisfies CustomerInsert;

		const { error } = await supabase.from('customer').insert(customer);

		if (error) {
			// TODO: LOG ERROR.
			return svelteError(500, {
				message:
					'Der Server hat einen unerwarteten Zustand festgestellt, der ihn daran gehindert hat, die Anfrage zu erfüllen.'
			});
		}

		return redirect(303, '/app/customers');
	}
} satisfies Actions;
