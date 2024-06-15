<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import { HeadTags } from '$lib/types/classes';
	import { superForm } from 'sveltekit-superforms';
	import {
		getModalStore,
		getToastStore,
		type ModalSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import Calendar from '$lib/components/Calendar.svelte';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export let data;

	$: headTags = new HeadTags(
		`MyPhysio ${$form.id ? 'edit' : 'add'} Pet`,
		$form.id
			? 'Edit existing Pet from your pets in MyPhysio'
			: 'add a new Pet to your pets in MyPhysio'
	);

	$: customer_id = data.customer_id;

	const { form, errors, enhance } = superForm(data?.form, {
		onError({ result }) {
			const modal: ModalSettings = {
				type: 'alert',
				title: 'Fehler',
				body: result.error.message
			};
			modalStore.trigger(modal);
		},
		onResult({ result }) {
			if (result.status === 303) {
				const t: ToastSettings = {
					message: $form.id
						? 'Haustier wurde erfolgreich bearbeitet!'
						: 'Haustier wurde erfolgreich erstellt!',
					background: 'variant-filled-warning'
				};
				toastStore.trigger(t);
			}
		}
	});
</script>

<Head {headTags} />

<h1 class="h1 mb-8">
	{$form.id ? `Haustier Bearbeiten [${$form.name}]` : 'Neuen Haustier hinzufügen'}
</h1>

<form class="space-y-8 w-full lg:w-[940px]" method="POST" use:enhance>
	{#if $form.id}
		<input type="hidden" name="id" bind:value={$form.id} />
	{/if}

	<div class="flex flex-col md:flex-row gap-4">
		<label class="label w-full">
			<span class="flex justify-start items-center gap-1">
				Name
				<iconify-icon icon="mdi:pets" observer="false" />
			</span>
			<input
				class="input"
				type="text"
				name="name"
				placeholder="Name"
				aria-invalid={$errors.name ? 'true' : undefined}
				bind:value={$form.name}
			/>
			{#if $errors.name}<p class="text-error-500-400-token">{$errors.name}</p>{/if}
		</label>

		<div class="label w-full">
			<span class="flex justify-start items-center gap-1">
				Alter
				<iconify-icon icon="mdi:dog" observer="false" />
			</span>
			<Calendar bind:selected={$form.age} name="age" />
			{#if $errors.age}<p class="text-error-500-400-token">{$errors.age}</p>{/if}
		</div>
	</div>

	<div class="flex flex-col md:flex-row gap-4">
		<label class="label w-full">
			<span class="flex justify-start items-center gap-1">
				Art
				<iconify-icon icon="mdi:horse" observer="false" />
			</span>
			<input
				class="input"
				type="text"
				name="species"
				placeholder="Art: BS. Pferd"
				aria-invalid={$errors.species ? 'true' : undefined}
				bind:value={$form.species}
			/>
			{#if $errors.species}<p class="text-error-500-400-token">{$errors.species}</p>{/if}
		</label>
		<label class="label w-full">
			<span class="flex justify-start items-center gap-1">
				Rasse
				<iconify-icon icon="mdi:dog-side" observer="false" />
			</span>
			<input
				class="input"
				type="text"
				name="breed"
				placeholder="Rasse"
				aria-invalid={$errors.breed ? 'true' : undefined}
				bind:value={$form.breed}
			/>
			{#if $errors.breed}<p class="text-error-500-400-token">{$errors.breed}</p>{/if}
		</label>
	</div>

	<label class="label w-full">
		<span class="flex justify-start items-center gap-1">
			Medizinische Vorgeschichte
			<iconify-icon icon="mdi:medical-bag" observer="false" />
		</span>
		<input
			class="input"
			type="text"
			name="medical_history"
			placeholder="Notizen"
			aria-invalid={$errors.medical_history ? 'true' : undefined}
			bind:value={$form.medical_history}
		/>
		{#if $errors.medical_history}<p class="text-error-500-400-token">
				{$errors.medical_history}
			</p>{/if}
	</label>

	<div class="flex flex-col-reverse sm:flex-row justify-end gap-4 sm:gap-2">
		<a href="/app/customers/{customer_id}" class="btn btn-md mr-2 variant-ghost-error">Abbrechen</a>
		<button type="submit" class="btn btn-md mr-2 variant-ghost-primary"
			>Haustier {$form.id ? 'speichern' : 'hinzufügen'}</button
		>
	</div>
</form>
