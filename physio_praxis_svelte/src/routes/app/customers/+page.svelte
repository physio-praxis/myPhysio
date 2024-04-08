<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import { HeadTags } from '$lib/types/classes';
	import 'iconify-icon';

	export let data;
	let { customerPetOverview } = data;

	const headTags = new HeadTags('MyPhysio Customers', 'a list of your customers at MyPhysio');
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
		href="/app/customers/add"
		class="w-12 btn-icon variant-filled-primary"
		title="Kunde hinzufügen"
	>
		<iconify-icon class="text-2xl" icon="mdi:user-add" observer="false" />
	</a>
</section>
<section class="flex flex-col space-y-2 w-full">
	{#if customerPetOverview}
		{#each customerPetOverview as customerPet}
			<a href="/" class="card p-4 w-full">
				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4"
				>
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
				</div>
			</a>
		{/each}
	{/if}
</section>
