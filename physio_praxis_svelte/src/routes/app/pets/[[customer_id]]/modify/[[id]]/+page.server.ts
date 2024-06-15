import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect, error as svelte_error, type Actions } from '@sveltejs/kit';
import type { Pet, PetInsert, PetUpdate } from '$lib/types/types';

const schema = z.object({
	id: z.number().optional(),
	customer_id: z.number(),
	name: z.string().min(2, 'Haustier Name sollte mindestens 2 Zeichen lang sein.'),
	species: z.string().min(2, 'Haustier Art sollte mindestens 2 Zeichen lang sein.'),
	breed: z.string().min(2, 'Haustier Rasse sollte mindestens 2 Zeichen lang sein.'),
	medical_history: z.string(),
	age: z.date()
});

export const load = async ({ params, locals: { supabase } }) => {
	const form = superValidate(zod(schema));

	const { id, customer_id } = params;

	// edit pet
	if (id) {
		const { data, error } = await supabase.from('pet').select('*').eq('pet_id', id).single();
		if (error) {
			return svelte_error(500, error.message);
		}
		const pet = data as Pet;
		(await form).data = {
			age: new Date(pet.age!),
			breed: pet.breed,
			customer_id: pet.customer_id,
			medical_history: pet.medical_history,
			name: pet.name,
			species: pet.species,
			id: pet.pet_id
		};
	}

	return { form: await form, customer_id: customer_id };
};

export const actions = {
	default: async ({ request, params, locals: { supabase } }) => {
		const form = await superValidate(request, zod(schema));

		const { customer_id } = params;

		if (customer_id === undefined) {
			return svelte_error(400, 'Unknown User');
		}

		const customerId = parseInt(customer_id);
		if (Number.isNaN(customerId)) {
			return svelte_error(400, 'Unknown User');
		}

		if (!form.valid) {
			return fail(400, { form });
		}

		// edit mode
		if (form.data.id) {
			const pet = {
				age: form.data.age,
				breed: form.data.breed,
				customer_id: customerId,
				medical_history: form.data.medical_history,
				name: form.data.name,
				species: form.data.species
			} satisfies PetUpdate;

			const { error } = await supabase.from('pet').update(pet).eq('pet_id', form.data.id);

			if (error) {
				// TODO: LOG ERROR.
				return svelte_error(500, {
					message:
						'Der Server hat einen unerwarteten Zustand festgestellt, der ihn daran gehindert hat, die Anfrage zu erfüllen.'
				});
			}
			// add mode
		} else {
			const pet = {
				age: form.data.age,
				breed: form.data.breed,
				customer_id: customerId,
				medical_history: form.data.medical_history,
				name: form.data.name,
				species: form.data.species
			} satisfies PetInsert;

			const { error } = await supabase.from('pet').insert(pet);

			if (error) {
				// TODO: LOG ERROR.
				return svelte_error(500, {
					message:
						'Der Server hat einen unerwarteten Zustand festgestellt, der ihn daran gehindert hat, die Anfrage zu erfüllen.'
				});
			}
		}

		return redirect(303, `/app/customers/${customerId}`);
	}
} satisfies Actions;
