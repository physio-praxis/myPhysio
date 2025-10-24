import {
	CustomerCreateSchema,
	type CustomerCreateInput
} from '$lib/validation/app/customer/customer.schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import { createCustomer } from '$lib/server/db/repos/customerRepo';
import { toStringMap } from '$lib/utils/formUtils';

export const load: PageServerLoad = async () => {
	return { form: { values: {} as Record<string, string>, errors: {} as Record<string, string> } };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const raw = toStringMap(formData);

		const parsed = CustomerCreateSchema.safeParse(raw);

		if (!parsed.success) {
			const errors: Record<string, string> = {};
			for (const issue of parsed.error.issues) {
				const issueKey = String(issue.path[0] ?? '_');
				if (!errors[issueKey]) errors[issueKey] = issue.message;
			}
			return fail(400, { values: raw, errors });
		}

		const input: CustomerCreateInput = parsed.data;
		let created;
		try {
			created = await createCustomer(input);
		} catch (_err: unknown) {
			console.error(_err);
			return fail(500, {
				values: raw,
				errors: {
					_global: 'Unerwarteter Fehler. Bitte später erneut versuchen.'
				} as Record<string, string>
			});
		}

		throw redirect(303, `/app/customer/${created?.customerId}`);
	}
};
