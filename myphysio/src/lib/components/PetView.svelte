<script lang="ts">
	import { resolve } from '$app/paths';
	import type { CustomerPet, CustomerPetTreatment } from '$lib/types/customerTypes';
	import { formatDateDMY, fromDateOnly } from '$lib/utils/dateUtils';
	import { Plus, Pencil, Trash, Eye } from '@lucide/svelte';

	let {
		pets,
		treatments,
		customerId
	}: {
		pets: CustomerPet[] | undefined;
		treatments: CustomerPetTreatment[] | undefined;
		customerId: number;
	} = $props();
	let petsExists = pets?.length !== undefined && pets.length > 0;
	let firstPetId = pets !== undefined && pets.length > 0 ? pets[0].petId.toString() : '';
	let selectedPetId = $state(firstPetId);
	const selectedPet = $derived(pets?.find((p) => String(p.petId) === selectedPetId));
	let selectedPetDetails = $derived([
		{ detailName: 'Rasse', detailValue: selectedPet?.breed ?? '-' },
		{ detailName: 'Tierart', detailValue: selectedPet?.species ?? '-' },
		{
			detailName: 'Geburtsdatum',
			detailValue: selectedPet?.birthdate
				? `${formatDateDMY(fromDateOnly(selectedPet.birthdate))} (${selectedPet.age})`
				: '-'
		},
		{ detailName: 'Krankengeschichte', detailValue: selectedPet?.medicalHistory ?? '-' }
	]);
	let selectedPetTreatments = $derived(
		treatments?.filter((t) => String(t.petId) === selectedPetId)
	);
</script>

<header class="mb-2 flex items-center justify-between">
	<h4 class="h4">Haustiere</h4>
	<a
		class="btn preset-filled-success-500"
		href={resolve(`/app/customer/[customerId]/pet/add`, { customerId: customerId.toString() })}
	>
		<Plus />
		<span class="hidden md:block">Haustier hinzufügen</span>
	</a>
</header>

{#if !petsExists}
	<div class="text-center">Keine Haustiere vorhanden</div>
{:else}
	<div class="flex flex-col space-y-6">
		<div class="flex flex-col space-y-4">
			{#if pets !== undefined}
				{#each pets as pet (pet.petId)}
					<label class="flex items-center space-x-2">
						<input
							class="radio"
							type="radio"
							name="radio-direct"
							value={String(pet.petId)}
							bind:group={selectedPetId}
						/>
						<p>{pet.name} ({pet.breed})</p>
					</label>
				{/each}
			{/if}
		</div>

		<div>
			<h4 class="h4">{selectedPet?.name}s Details</h4>
			<div class="table-wrap">
				<table class="table">
					<tbody>
						{#each selectedPetDetails as { detailName, detailValue } (detailName)}
							<tr>
								<td>{detailName}</td>
								<td>{detailValue}</td>
							</tr>
						{/each}
						<tr>
							<td>Aktionen</td>
							<td class="flex space-x-4">
								<a
									class="btn preset-filled-primary-500"
									href={resolve(`/app/customer/[customerId]/pet/[petId]/edit`, {
										customerId: String(customerId),
										petId: selectedPetId
									})}
								>
									<Pencil />
									<span class="hidden md:block">Haustier bearbeiten</span>
								</a>
								<a
									class="btn preset-filled-error-500"
									href={resolve(`/app/customer/[customerId]/pet/[petId]/delete`, {
										customerId: String(customerId),
										petId: selectedPetId
									})}
								>
									<Trash />
									<span class="hidden md:block">Haustier löschen</span>
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div>
			<h4 class="mb-2 h4">Letzte 5 Behandlungen</h4>
			{#if selectedPetTreatments !== undefined && selectedPetTreatments.length > 0}
				<div class="table-wrap rounded border border-surface-500">
					<table class="table">
						<thead class="bg-surface-100-900">
							<tr>
								<th>Datum</th>
								<th>Typ</th>
								<th>Notizen</th>
								<th>Aktion</th>
							</tr>
						</thead>
						<tbody>
							{#if selectedPetTreatments !== undefined}
								{#each selectedPetTreatments as treatment (treatment.petTreatmentId)}
									<tr>
										<td>{formatDateDMY(treatment.createdAt)}</td>
										<td>{treatment.treatmentName}</td>
										<td>TBD</td>
										<td>
											<a
												class="btn preset-filled-primary-500"
												href={resolve(`/app/treatment/[treatmentId]`, {
													treatmentId: String(treatment.treatmentId)
												})}
											>
												<Eye />
												<span class="hidden md:block">Anzeigen</span>
											</a>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="text-center">--- Keine Behandlungen verfügbar ---</div>
			{/if}
		</div>
	</div>
{/if}
