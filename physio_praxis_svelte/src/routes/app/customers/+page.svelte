<script lang="ts">
	import 'iconify-icon';

	export let data;
	let { customerPetOverview } = data;
</script>

<main class="p-2 space-y-4">
	<h1 class="h1">Kunden</h1>
	<section class="flex space-x-2">
		<div class="input-group input-group-divider grid-cols-[1fr_auto] max-w-96">
			<input class="input" title="Kunden suche" type="search" placeholder="Suche..." />
			<div class="input-group-shim">
				<iconify-icon class="text-2xl" icon="mdi:search" observer="false" />
			</div>
		</div>
		<button type="button" class="btn-icon variant-filled-primary" title="Kunde hinzufügen">
			<iconify-icon class="text-2xl" icon="mdi:user-add" observer="false" />
		</button>
	</section>
	<section class="flex flex-col space-y-2 w-full">
		{#if customerPetOverview}
			{#each customerPetOverview as customerPet}
				<a href="/" class="card p-4 w-full">
					<div class="grid grid-cols-6 justify-between">
						<p class="text-primary-600-300-token">Kunde</p>
						<p>{customerPet.customer_name}</p>
						<p>{customerPet.phone_number}</p>
						<p>{customerPet.email}</p>
						<p class="col-span-2 mb-4">{customerPet.address}</p>
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
</main>
