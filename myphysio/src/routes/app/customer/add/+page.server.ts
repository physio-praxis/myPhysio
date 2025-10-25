import {
	CustomerCreateSchema,
	type CustomerCreateInput
} from '$lib/validation/app/customer/customer.schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import { createCustomer, saveConsentFile } from '$lib/server/db/repos/customerRepo';
import { toStringMap } from '$lib/utils/formUtils';

export const load: PageServerLoad = async () => {
	return { form: { values: {} as Record<string, string>, errors: {} as Record<string, string> } };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const raw = toStringMap(formData);
		const consent = formData.get('consent');
		const consentFile = consent instanceof File && consent.size > 0 ? consent : null;

		const parsed = CustomerCreateSchema.safeParse(raw);

		if (!parsed.success) {
			const errors: Record<string, string> = {};
			for (const issue of parsed.error.issues) {
				const issueKey = String(issue.path[0] ?? '_');
				if (!errors[issueKey]) errors[issueKey] = issue.message;
			}
			return fail(400, { values: raw, errors });
		}

		if (consentFile) {
			const okType = 
				consentFile.type === 'application/pdf' || consentFile.type === 'text/plain';
				const okSize = consentFile.size <= 1024 * 1024 * 15; // 15 MB
			if (!okType || !okSize) {
				const errors: Record<string, string> = {};
				if (!okType) {
					errors['consent'] = 'Nur PDF- und Textdateien sind erlaubt.';
				} else if (!okSize) {
					errors['consent'] = 'Die Datei darf maximal 15 MB groß sein.';
				}
				return fail(400, { values: raw, errors });
			} 
		}

		const input: CustomerCreateInput = parsed.data;
		let created;
		try {
			created = await createCustomer(input);
			if (consentFile) {
				await saveConsentFile({ customerId: created.customerId, file: consentFile });
			}
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
