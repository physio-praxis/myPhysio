import { z } from 'zod';
import validator from 'validator';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, type Actions, redirect, error as svelteError } from '@sveltejs/kit';
import type { Customer, CustomerInsert, CustomerUpdate } from '$lib/types/types';
import { error as svelte_error } from '@sveltejs/kit';

const schema = z.object({
	id: z.string().optional(),
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

export const load = async ({ params, locals: { supabase } }) => {
	const form = superValidate(zod(schema));

	const { id } = params;

	// edit user
	if (id) {
		const { data, error } = await supabase
			.from('customer')
			.select('*')
			.eq('customer_id', id)
			.single();
		if (error) {
			return svelte_error(500, error.message);
		}
		const customer = data as Customer;
		(await form).data = {
			firstName: customer.name?.split(' ')[0] ?? '',
			lastName: customer.name?.split(' ')[1] ?? '',
			id: customer.customer_id.toString(),
			phoneNumber: customer.phone_number ?? undefined,
			email: customer.email ?? undefined,
			address: customer.address ?? undefined
		};
	}

	return { form: await form };
};

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// edit mode
		if (form.data.id) {
			const customer = {
				name: `${form.data.firstName} ${form.data.lastName}`,
				phone_number: form.data.phoneNumber,
				email: form.data.email,
				address: form.data.address
			} satisfies CustomerUpdate;

			const { error } = await supabase
				.from('customer')
				.update(customer)
				.eq('customer_id', form.data.id);

			if (error) {
				// TODO: LOG ERROR.
				return svelteError(500, {
					message:
						'Der Server hat einen unerwarteten Zustand festgestellt, der ihn daran gehindert hat, die Anfrage zu erfüllen.'
				});
			}
			// add mode
		} else {
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
		}

		return redirect(303, '/app/customers');
	}
} satisfies Actions;
