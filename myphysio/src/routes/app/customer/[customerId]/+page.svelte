<script lang="ts">
	import { resolve } from '$app/paths';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PetView from '$lib/components/PetView.svelte';
	import type { CustomerDetails } from '$lib/types/customerTypes';
	import type { Crumb } from '$lib/types/navigationTypes';
	import { UserPen, UserMinus } from '@lucide/svelte';

	interface Data {
		customer: CustomerDetails;
		breadCrumb: Crumb[];
	}

	let { data }: { data: Data } = $props();
	let customer = data.customer;
	let breadCrumb = data.breadCrumb;

	let customerDetails = [
		{ detailName: 'Telefonnummer', detailValue: customer.phoneNumber },
		{ detailName: 'E-Mail', detailValue: customer.email },
		{ detailName: 'Adresse', detailValue: customer.address },
		{ detailName: 'Beachtenswerte Notizen', detailValue: 'TBD' },
		{
			detailName: 'DSGVO-Einwilligung unterzeichnet',
			detailValue: customer.hasConsent
				? customer.consentFilename
				: 'Keine unterzeichnete DSGVO-Einwilligung',
			href: `/app/customer/[customerId]/consent`
		}
	];
</script>

<Breadcrumb items={breadCrumb} />
<article class="mb-8 flex flex-col space-y-6">
	<header class="flex flex-col space-x-4">
		<h3 class="h3">{customer.name}</h3>
		<div class="flex items-center justify-between">
			<span class="text-gray-500">Kunden-ID: {customer.customerId}</span>
			<div class="flex space-x-2">
				<a
					class="btn flex preset-filled-primary-500"
					href={resolve('/app/customer/[customerId]/edit', {
						customerId: customer.customerId.toString()
					})}
				>
					<UserPen />
					<span class="hidden md:block">Kunden bearbeiten</span>
				</a>
				<a
					class="btn flex preset-filled-error-500"
					href={resolve('/app/customer/[customerId]/delete', {
						customerId: customer.customerId.toString()
					})}
				>
					<UserMinus />
					<span class="hidden md:block">Kunden löschen</span>
				</a>
			</div>
		</div>
	</header>

	<section>
		<h4 class="h4">Kundendetails</h4>
		<div class="table-wrap">
			<table class="table">
				<tbody>
					{#each customerDetails as { detailName, detailValue, href } (detailName)}
						<tr>
							<td>{detailName}</td>
							<td>
								{#if href}
									<a
										href={resolve(href, { customerId: customer.customerId.toString() })}
										class="anchor"
										data-sveltekit-reload>{detailValue}</a
									>
								{:else}
									{detailValue}
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section>
		<PetView
			pets={customer.pets}
			treatments={customer.last5Treatments}
			customerId={customer.customerId}
		/>
	</section>
</article>
