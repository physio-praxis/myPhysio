<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import { HeadTags } from '$lib/types/classes';
	import type { CustomerPetOverview } from '$lib/types/types';
	import {
		ProgressRadial,
		getModalStore,
		getToastStore,
		type ModalSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import axios, { AxiosError } from 'axios';
	import 'iconify-icon';

	const headTags = new HeadTags('MyPhysio Customers', 'a list of your customers at MyPhysio');
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let customerPetOverviewPromise: Promise<CustomerPetOverview[]> = getPetOverviewPromise();

	async function getPetOverviewPromise() {
		try {
			const response = await axios.get<CustomerPetOverview[]>('/app/customers');
			return response.data;
		} catch (error) {
			return await Promise.reject(error);
		}
	}

	function deleteCustomer(customerId: number, customerName: string) {
		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Löschen bestätigen',
			body: `Sind Sie sicher, dass Sie den Benutzer (${customerName}) löschen möchten?`,
			response: (r: boolean) => (r ? confirmDeleteUser(customerId) : undefined)
		};
		modalStore.trigger(modal);
	}

	function confirmDeleteUser(customerId: number) {
		axios
			.delete(`/app/customers/${customerId}`)
			.then(() => {
				const t: ToastSettings = {
					message: 'Kunde wurde erfolgreich gelöscht',
					background: 'variant-filled-warning'
				};
				customerPetOverviewPromise = getPetOverviewPromise();
				toastStore.trigger(t);
			})
			.catch((error: AxiosError) => {
				const modal: ModalSettings = {
					type: 'alert',
					title: 'Fehler',
					body: error.message
				};
				modalStore.trigger(modal);
			});
	}
</script>

<Head {headTags} />

<h1 class="h1 mb-8">Kunden</h1>
<section class="flex space-x-2 self-start">
	<div class="input-group input-group-divider grid-cols-[1fr_auto]">
		<input class="input max-w-96" title="Kunden suche" type="search" placeholder="Suche..." />
		<div class="input-group-shim !hidden sm:!flex">
			<iconify-icon class="text-2xl" icon="mdi:search" observer="false" />
		</div>
	</div>
	<a
		href="/app/customers/modify"
		class="w-12 btn-icon variant-filled-primary"
		title="Kunde hinzufügen"
	>
		<iconify-icon class="text-2xl" icon="mdi:user-add" observer="false" />
	</a>
</section>
<section class="flex flex-col space-y-2 w-full h-full">
	{#await customerPetOverviewPromise}
		<div class="w-full h-full flex flex-col items-center justify-center gap-4">
			<p>Kunden werden geladen...</p>
			<ProgressRadial width="w-16" meter="stroke-primary-500" track="stroke-primary-500/30" />
		</div>
	{:then customerPetOverview}
		{#if customerPetOverview.length > 0}
			{#each customerPetOverview as customerPet}
				<a href="/app/customers/{customerPet.customer_id}" class="card p-4 w-full">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
						<p class="text-primary-600-300-token">Kunde</p>
						<p>{customerPet.customer_name}</p>
						<p>{customerPet.phone_number}</p>
						<p>{customerPet.email}</p>
						<p class="col-span-full md:col-span-2 mb-4">{customerPet.address}</p>
						{#each customerPet.pets as pet, key}
							<p class="text-primary-600-300-token">Pet #{key + 1}</p>
							<p>{pet.pet_name}</p>
							<p>{pet.pet_species}</p>
							<p>{pet.pet_breed}</p>
							<p>{pet.pet_age}</p>
							<p>{pet.pet_medical_history}</p>
						{/each}
						<div class="flex w-full h-full col-span-6 justify-end gap-x-4">
							<button
								class="btn variant-filled-error"
								title="löschen"
								on:click|preventDefault={() =>
									deleteCustomer(customerPet.customer_id, customerPet.customer_name)}
							>
								<iconify-icon class="text-2xl" icon="mdi:delete" observer="false" />
							</button>
							<a
								href="/app/customers/modify/{customerPet.customer_id}"
								class="btn variant-filled-secondary"
								title="bearbeiten"
							>
								<iconify-icon class="text-2xl" icon="mdi:edit" observer="false" />
							</a>
						</div>
					</div>
				</a>
			{/each}
		{:else}
			<div class="flex justify-center items-center mt-8">
				<div class="card h-fit flex p-4">
					<iconify-icon class="text-2xl text-primary-600" icon="mdi:person-off" observer="false" />
					<p>Es wurden keine Kunden gefunden!</p>
				</div>
			</div>
		{/if}
	{/await}
</section>
