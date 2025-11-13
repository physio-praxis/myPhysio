import {
	ConsentFileSchema,
	CustomerSchema,
	type CustomerInput
} from '$lib/validation/app/customer/customer.schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import { createCustomer, saveConsentFile } from '$lib/server/db/repos/customerRepo';
import { toStringMap } from '$lib/utils/formUtils';
import { getErrorConstraint, isUniqueViolation } from '$lib/utils/exeptionUtils';
import {
	uniqueCustomerEmail as uniqueCustomerEmailConstraint,
	uniqueCustomerPhone as uniqueCustomerPhoneConstraint
} from '$lib/server/db/constants';

export const load: PageServerLoad = async () => {
	return { form: { values: {} as Record<string, string>, errors: {} as Record<string, string> } };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const raw = toStringMap(formData);
		const consent = formData.get('consent');
		const consentFile = consent instanceof File && consent.size > 0 ? consent : null;

		const parsed = CustomerSchema.safeParse(raw);

		if (!parsed.success) {
			const errors: Record<string, string> = {};
			for (const issue of parsed.error.issues) {
				const issueKey = String(issue.path[0] ?? '_');
				if (!errors[issueKey]) errors[issueKey] = issue.message;
			}
			return fail(400, { values: raw, errors });
		}

		if (consentFile) {
			const parsedConsentFile = ConsentFileSchema.safeParse(consentFile);
			if (!parsedConsentFile.success) {
				const errors: Record<string, string> = {};
				for (const issue of parsedConsentFile.error.issues) {
					errors['consent'] = issue.message;
					break;
				}
				return fail(400, { values: raw, errors });
			}
		}

		const input: CustomerInput = parsed.data;
		let created;
		try {
			created = await createCustomer({
				firstName: input.firstName,
				lastName: input.lastName,
				email: input.email,
				phoneNumber: input.phone,
				street: input.street,
				additionalAddress: input.additionalAddress || null,
				postalCode: input.postalCode,
				city: input.city,
				country: input.country
			});
			if (consentFile) {
				await saveConsentFile({ customerId: created.customerId, file: consentFile });
			}
		} catch (_err: unknown) {
			if (isUniqueViolation(_err)) {
				const constraint = getErrorConstraint(_err);
				return fail(400, {
					values: raw,
					errors: {
						email:
							constraint === uniqueCustomerEmailConstraint
								? 'Diese Email ist bereits vergeben. Bitte verwende eine andere.'
								: null,
						phone:
							constraint === uniqueCustomerPhoneConstraint
								? 'Diese Telefonnummer ist bereits vergeben. Bitte verwende eine andere.'
								: null
					}
				});
			}
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
