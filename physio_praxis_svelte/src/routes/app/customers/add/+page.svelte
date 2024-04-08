<script lang="ts">
	import { goto } from '$app/navigation';
	import Head from '$lib/components/Head.svelte';
	import { HeadTags } from '$lib/types/classes';

	const headTags = new HeadTags(
		'MyPhysio add customer',
		'add a new customer to your customers in MyPhysio'
	);

	function onCancelClick() {
		goto('/app/customers');
	}
</script>

<Head {headTags} />

<h1 class="h1 mb-8">Neuen Kunden hinzufügen</h1>

<form class="space-y-8 w-full lg:w-[940px]">
	<div class="flex flex-col md:flex-row gap-4">
		<label class="label w-full">
			<span class="flex justify-start items-center gap-1">
				Vorname
				<iconify-icon icon="mdi:person" observer="false" />
			</span>
			<input class="input" type="text" name="firstName" placeholder="Vorname" required />
		</label>
		<label class="label w-full">
			<span class="flex justify-start items-center gap-1">
				Nachname
				<iconify-icon icon="mdi:person" observer="false" />
			</span>
			<input class="input" type="text" name="lastName" placeholder="Nachname" required />
		</label>
	</div>

	<div class="flex flex-col md:flex-row gap-4">
		<label class="label w-full">
			<span class="flex justify-start items-center gap-1">
				Telefonnummer
				<iconify-icon icon="mdi:telephone" observer="false" />
			</span>
			<input class="input" type="tel" name="phoneNumber" placeholder="Telefonnummer" />
		</label>
		<label class="label w-full">
			<span class="flex justify-start items-center gap-1">
				E-Mail
				<iconify-icon icon="mdi:email" observer="false" />
			</span>
			<input class="input" type="email" name="email" placeholder="E-Mail" />
		</label>
	</div>

	<label class="label w-full">
		<span class="flex justify-start items-center gap-1">
			Adresse
			<iconify-icon icon="mdi:map-marker" observer="false" />
		</span>
		<input class="input" type="text" name="address" placeholder="Adresse" />
	</label>

	<div class="flex flex-col-reverse sm:flex-row justify-end gap-4 sm:gap-2">
		<button type="button" class="btn btn-md mr-2 variant-ghost-error" on:click={onCancelClick}
			>Abbrechen</button
		>
		<button type="submit" class="btn btn-md mr-2 variant-ghost-primary">Kunde hinzufügen</button>
	</div>
</form>
