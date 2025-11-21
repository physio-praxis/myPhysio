<script lang="ts">
	import { resolve } from '$app/paths';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import PetView from '$lib/components/PetView.svelte';
	import type { CustomerDetails } from '$lib/types/customerTypes';
	import type { Crumb } from '$lib/types/navigationTypes';
	import type { FormType } from '$lib/types/formTypes';
	import { UserPen, UserMinus, LoaderCircle } from '@lucide/svelte';
	import { Modal } from '@skeletonlabs/skeleton-svelte';
	import { enhance } from '$app/forms';

	interface Data {
		customer: CustomerDetails;
		breadCrumb: Crumb[];
	}

	let { data, form }: { data: Data; form?: FormType } = $props();
	let customer = data.customer;
	let breadCrumb = data.breadCrumb;
	let deleteErrors = $derived(form?.errors ?? {});

	const formatAddress = (customer: CustomerDetails) => {
		const parts = [
			customer.street,
			customer.additionalAddress,
			`${customer.postalCode || ''} ${customer.city || ''}`.trim(),
			customer.country
		].filter((part) => part && part.trim());

		return parts.length > 0 ? parts.join(', ') : '---';
	};

	let customerDetails = [
		{ detailName: 'Telefonnummer', detailValue: customer.phoneNumber },
		{ detailName: 'E-Mail', detailValue: customer.email },
		{ detailName: 'Adresse', detailValue: formatAddress(customer) },
		{
			detailName: 'DSGVO-Einwilligung unterzeichnet',
			detailValue: customer.hasConsent
				? customer.consentFilename
				: 'Keine unterzeichnete DSGVO-Einwilligung',
			href: customer.hasConsent ? `/app/customer/[customerId]/consent` : null
		}
	];
	let deleteModalOpenState = $state(false);
	let isDeleting = $state(false);
	function deleteModalClose() {
		deleteModalOpenState = false;
	}
</script>

<Breadcrumb items={breadCrumb} />
<article class="mb-8 flex flex-col space-y-6">
	<header class="flex flex-col space-x-4">
		<h3 class="h3">{customer.firstName} {customer.lastName}</h3>
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
				<button
					type="button"
					class="btn flex preset-filled-error-500"
					onclick={() => (deleteModalOpenState = true)}
				>
					<UserMinus />
					<span class="hidden md:block">Kunden löschen</span>
				</button>
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

<Modal
	open={deleteModalOpenState}
	onOpenChange={(e) => (deleteModalOpenState = e.open)}
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		<form
			method="POST"
			action="?/delete"
			use:enhance={() => {
				isDeleting = true;
				return async ({ update }) => {
					await update();
					isDeleting = false;
				};
			}}
		>
			<header class="flex justify-between">
				<h2 class="h2">Kunde löschen?</h2>
			</header>

			{#if deleteErrors._global}
				<div class="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
					{deleteErrors._global}
				</div>
			{/if}

			<article class="mb-4">
				<p class="mb-2">
					Sind Sie sicher, dass Sie den Kunden <code class="code"
						>{customer.firstName} {customer.lastName}</code
					> löschen möchten?
				</p>
				<p>Folgendes wird gelöscht:</p>
				<ul class="mb-2 list-inside list-disc">
					<li>Kundendaten</li>
					<li>Alle Tiere ({customer.pets?.length || 0} Tiere)</li>
					<li>Alle Behandlungen</li>
					<li>GDPR-Einwilligungsdateien</li>
				</ul>
				<blockquote class="blockquote">
					Diese Aktion kann nicht rückgängig gemacht werden!
				</blockquote>
			</article>
			<footer class="flex justify-end gap-4">
				<button
					type="button"
					class="btn preset-tonal"
					onclick={deleteModalClose}
					disabled={isDeleting}
				>
					Abbrechen
				</button>
				<button
					type="submit"
					class="btn flex items-center preset-filled-error-500"
					disabled={isDeleting}
				>
					{#if isDeleting}
						<LoaderCircle class="animate-spin" size="20" />
					{:else}
						<UserMinus size="20" />
					{/if}
					Löschen
				</button>
			</footer>
			<!-- hidden input with customerId -->
			<input type="hidden" name="customerId" value={customer.customerId} />
		</form>
	{/snippet}
</Modal>
