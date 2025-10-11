import { db } from '$lib/server/db/db.js';
import { customerDetailsView } from '$lib/server/db/schema.js';
import { error } from '@sveltejs/kit';
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
