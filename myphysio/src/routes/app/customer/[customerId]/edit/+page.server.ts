import type { PageServerLoad } from '../$types';
import { customer, customerConsent } from '$lib/server/db/schema';
import { db } from '$lib/server/db/db';
import { eq, desc, and } from 'drizzle-orm';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { ConsentFileSchema, CustomerSchema } from '$lib/validation/app/customer/customer.schema';
import { saveConsentFile, updateCustomer } from '$lib/server/db/repos/customerRepo';
import { toStringMap } from '$lib/utils/formUtils';

export const load: PageServerLoad = async ({ params }) => {
	const customerId = parseInt(params.customerId);

	if (isNaN(customerId)) {
		throw error(400, 'Ungültige Kunden-ID');
	}

	const [cus] = await db.select().from(customer).where(eq(customer.customerId, customerId));

	if (!cus) {
		throw error(404, 'Kunde nicht gefunden');
	}

	const [latestConsent] = await db
		.select()
		.from(customerConsent)
		.where(and(eq(customerConsent.customerId, customerId), eq(customerConsent.isLatest, true)))
		.orderBy(desc(customerConsent.uploadedAt))
		.limit(1);

	const customerWithConsent = {
		...cus,
		hasConsent: !!latestConsent,
		consentFilename: latestConsent?.filename || null,
		consentUploadedAt: latestConsent?.uploadedAt.toISOString() || null
	};

	const breadCrumb = [
		{ label: 'Kunden', href: '/app/customer' },
		{ label: `${cus.firstName} ${cus.lastName}`, href: `/app/customer/${customerId}` },
		{ label: 'Bearbeiten', href: `/app/customer/${customerId}/edit` }
	];

	return {
		customer: customerWithConsent,
		breadCrumb,
		form: { values: {} as Record<string, string>, errors: {} as Record<string, string> }
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const customerId = parseInt(params.customerId);

		if (isNaN(customerId)) {
			return fail(400, {
				values: {},
				errors: { _global: 'Ungültige Kunden-ID' } as Record<string, string>
			});
		}

		const formData = await request.formData();
		const raw = toStringMap(formData);
		const consentFile = formData.get('consentFile');
		const consentFileObj = consentFile instanceof File && consentFile.size > 0 ? consentFile : null;

		// Validate customer data
		const parsed = CustomerSchema.safeParse(raw);
		if (!parsed.success) {
			const errors: Record<string, string> = {};
			for (const issue of parsed.error.issues) {
				const issueKey = String(issue.path[0] ?? '_');
				if (!errors[issueKey]) errors[issueKey] = issue.message;
			}
			return fail(400, { values: raw, errors });
		}

		// Validate consent file if provided
		if (consentFileObj) {
			const parsedConsentFile = ConsentFileSchema.safeParse(consentFileObj);
			if (!parsedConsentFile.success) {
				const errors: Record<string, string> = {};
				for (const issue of parsedConsentFile.error.issues) {
					errors['consentFile'] = issue.message;
					break;
				}
				return fail(400, { values: raw, errors });
			}
		}

		try {
			// Update customer
			await updateCustomer({
				customerId,
				firstName: parsed.data.firstName,
				lastName: parsed.data.lastName,
				email: parsed.data.email || null,
				phoneNumber: parsed.data.phone || null,
				street: parsed.data.street || null,
				additionalAddress: parsed.data.additionalAddress || null,
				postalCode: parsed.data.postalCode || null,
				city: parsed.data.city || null,
				country: parsed.data.country || null
			});

			// Upload new consent file if provided
			if (consentFileObj) {
				await saveConsentFile({ customerId, file: consentFileObj });
			}
		} catch {
			return fail(500, {
				values: raw,
				errors: {
					_global: 'Fehler beim Aktualisieren des Kunden'
				} as Record<string, string>
			});
		}

		throw redirect(303, `/app/customer/${customerId}`);
	}
};
