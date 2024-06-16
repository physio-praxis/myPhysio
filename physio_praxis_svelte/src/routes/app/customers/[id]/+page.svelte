<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import { formatDateToGerman } from '$lib/services/dateService.js';
	import { HeadTags } from '$lib/types/classes';
	import type { Customer, Pet } from '$lib/types/types.js';
	import {
		ProgressRadial,
		getModalStore,
		getToastStore,
		type ModalSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import axios, { AxiosError } from 'axios';
	import { onMount } from 'svelte';

	const headTags = new HeadTags('View MyPhysio Customer', 'a customer at MyPhysio');
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export let data;

	let customer: Customer;

	$: customer = data.customer;

	let petsPromise: Promise<Pet[]>;

	onMount(() => {
		petsPromise = getPetsPromise();
	});

	async function getPetsPromise() {
		try {
			const response = await axios.get<Pet[]>(`/app/pets/${customer.customer_id}/get`);
			return response.data;
		} catch (error) {
			return await Promise.reject(error);
		}
	}

	async function copyToClipboard(value: string) {
		await navigator.clipboard.writeText(value);
	}

	function deletePet(petId: number, petName: string | null) {
		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Löschen bestätigen',
			body: `Sind Sie sicher, dass Sie den Haustier (${petName}) löschen möchten?`,
			response: (r: boolean) => (r ? confirmDeletePet(petId) : undefined)
		};
		modalStore.trigger(modal);
	}

	function confirmDeletePet(petId: number) {
		axios
			.delete(`/app/pets/${petId}`)
			.then(() => {
				const t: ToastSettings = {
					message: 'Haustier wurde erfolgreich gelöscht',
					background: 'variant-filled-warning'
				};
				toastStore.trigger(t);
				petsPromise = getPetsPromise();
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

<h1 class="h1 mb-8">{customer.name}</h1>

<section class="w-full lg:w-[940px]">
	<div class="flex flex-col justify-between">
		<h2 class="h2 mb-4">Kundeninformation</h2>
		<table class="table table-hover">
			<tbody class="*:flex *:justify-center *:items-center">
				<tr>
					<th class="p-2">Name:</th>
					<td class="w-full"><div class="text-xl">{customer.name}</div></td>
					<td>
						<button
							class="btn variant-filled-secondary"
							title="kopieren"
							on:click={() => copyToClipboard(customer.name ?? '')}
						>
							<iconify-icon icon="mdi:content-copy" observer="false" />
						</button>
					</td>
				</tr>
				<tr>
					<th class="p-2">Telefonnummer:</th>
					<td class="w-full"><div class="text-xl">{customer.phone_number}</div></td>
					<td>
						<button
							class="btn variant-filled-secondary"
							title="kopieren"
							on:click={() => copyToClipboard(customer.phone_number ?? '')}
						>
							<iconify-icon icon="mdi:content-copy" observer="false" />
						</button>
					</td>
				</tr>
				<tr>
					<th class="p-2 text-nowrap">E-Mail:</th>
					<td class="w-full"><div class="text-xl">{customer.email}</div></td>
					<td>
						<button
							class="btn variant-filled-secondary"
							title="kopieren"
							on:click={() => copyToClipboard(customer.email ?? '')}
						>
							<iconify-icon icon="mdi:content-copy" observer="false" />
						</button>
					</td>
				</tr>
				<tr>
					<th class="p-2 text-nowrap">Adresse:</th>
					<td class="w-full"><div class="text-xl">{customer.address}</div></td>
					<td>
						<button
							class="btn variant-filled-secondary"
							title="kopieren"
							on:click={() => copyToClipboard(customer.address ?? '')}
						>
							<iconify-icon icon="mdi:content-copy" observer="false" />
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</section>
<section class="w-full lg:w-[940px]">
	<div class="flex flex-col justify-between">
		<div class="flex gap-2">
			<h2 class="h2 mb-4">Haustiere</h2>
			<a
				href="/app/pets/{customer.customer_id}/modify"
				class="w-12 h-12 btn-icon variant-filled-primary"
				title="Haustier hinzufügen"
			>
				<iconify-icon class="text-2xl" icon="mdi:plus" observer="false" />
			</a>
		</div>
		<table class="table table-hover">
			<thead>
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Tierart</th>
					<th>Rasse</th>
					<th>Geboren</th>
					<th>Medizinische Vorgeschichte</th>
					<th>Aktionen</th>
				</tr>
			</thead>
			<tbody>
				{#if petsPromise}
					{#await petsPromise}
						<div class="w-full h-full flex flex-col items-center justify-center gap-4">
							<p>Haustiere werden geladen...</p>
							<ProgressRadial
								width="w-16"
								meter="stroke-primary-500"
								track="stroke-primary-500/30"
							/>
						</div>
					{:then pets}
						{#each pets as pet, i}
							<tr>
								<td>{i + 1}</td>
								<td>{pet.name}</td>
								<td>{pet.species ?? ''}</td>
								<td>{pet.breed ?? ''}</td>
								<td>{formatDateToGerman(pet.age)}</td>
								<td class="w-full">{pet.medical_history ?? ''}</td>
								<td class="flex gap-2">
									<a
										href="/app/pets/{customer.customer_id}/modify/{pet.pet_id}"
										class="btn variant-filled-secondary"
										title="bearbeiten"
									>
										<iconify-icon class="text-2xl" icon="mdi:edit" observer="false" />
									</a>
									<button
										class="btn variant-filled-error"
										title="löschen"
										on:click={() => deletePet(pet.pet_id, pet.name)}
									>
										<iconify-icon class="text-2xl" icon="mdi:delete" observer="false" />
									</button>
								</td>
							</tr>
						{/each}
					{/await}
				{/if}
			</tbody>
		</table>
	</div>
</section>
