import { db } from '$lib/server/db/db.js';
import { deleteCustomer } from '$lib/server/db/repos/customerRepo';
import { customerDetailsView } from '$lib/server/db/schema.js';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
	const id = Number(params.customerId);
	if (isNaN(id)) throw error(400, 'Invalid customer Id');

	const [customer] = await db
		.select()
		.from(customerDetailsView)
		.where(eq(customerDetailsView.customerId, id))
		.limit(1);

	if (!customer) throw error(404, 'Customer not found');
	const breadcrumbTitle = customer.name ?? `Kunde #${customer.customerId}`;

	return {
		customer,
		breadCrumb: [
			{ href: '/app/customer', label: 'Kunde' },
			{ href: `/app/customer/${customer.customerId}`, label: breadcrumbTitle }
		]
	};
}

export const actions: Actions = {
	delete: async ({ params }) => {
		const customerId = Number(params.customerId);

		if (isNaN(customerId)) {
			return fail(400, {
				errors: { _global: 'Ungültige Kunden-ID' }
			});
		}

		try {
			await deleteCustomer(customerId);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Fehler beim Löschen des Kunden';
			return fail(500, {
				errors: { _global: message }
			});
		}

		throw redirect(303, '/app/customer');
	}
};
