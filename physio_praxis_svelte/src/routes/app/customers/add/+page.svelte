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

	const modalStore = getModalStore();
	const toastStore = getToastStore();
	const headTags = new HeadTags(
		'MyPhysio add customer',
		'add a new customer to your customers in MyPhysio'
	);

	export let data;

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
					message: 'Kunde wurde erfolgreich erstellt!',
					background: 'variant-filled-warning'
				};
				toastStore.trigger(t);
			}
		}
	});
</script>

<Head {headTags} />

<h1 class="h1 mb-8">Neuen Kunden hinzufügen</h1>

<form class="space-y-8 w-full lg:w-[940px]" method="POST" use:enhance>
	<div class="flex flex-col md:flex-row gap-4">
		<label class="label w-full">
			<span class="flex justify-start items-center gap-1">
				Vorname
				<iconify-icon icon="mdi:person" observer="false" />
			</span>
			<input
				class="input"
				type="text"
				name="firstName"
				placeholder="Vorname"
				aria-invalid={$errors.firstName ? 'true' : undefined}
				bind:value={$form.firstName}
			/>
			{#if $errors.firstName}<p class="text-error-500-400-token">{$errors.firstName}</p>{/if}
		</label>
		<label class="label w-full">
			<span class="flex justify-start items-center gap-1">
				Nachname
				<iconify-icon icon="mdi:person" observer="false" />
			</span>
			<input
				class="input"
				type="text"
				name="lastName"
				placeholder="Nachname"
				aria-invalid={$errors.lastName ? 'true' : undefined}
				bind:value={$form.lastName}
			/>
			{#if $errors.lastName}<p class="text-error-500-400-token">{$errors.lastName}</p>{/if}
		</label>
	</div>

	<div class="flex flex-col md:flex-row gap-4">
		<label class="label w-full">
			<span class="flex justify-start items-center gap-1">
				Telefonnummer
				<iconify-icon icon="mdi:telephone" observer="false" />
			</span>
			<input
				class="input"
				type="tel"
				name="phoneNumber"
				placeholder="Telefonnummer"
				aria-invalid={$errors.phoneNumber ? 'true' : undefined}
				bind:value={$form.phoneNumber}
			/>
			{#if $errors.phoneNumber}<p class="text-error-500-400-token">{$errors.phoneNumber}</p>{/if}
		</label>
		<label class="label w-full">
			<span class="flex justify-start items-center gap-1">
				E-Mail
				<iconify-icon icon="mdi:email" observer="false" />
			</span>
			<input
				class="input"
				type="email"
				name="email"
				placeholder="E-Mail"
				aria-invalid={$errors.email ? 'true' : undefined}
				bind:value={$form.email}
			/>
			{#if $errors.email}<p class="text-error-500-400-token">{$errors.email}</p>{/if}
		</label>
	</div>

	<label class="label w-full">
		<span class="flex justify-start items-center gap-1">
			Adresse
			<iconify-icon icon="mdi:map-marker" observer="false" />
		</span>
		<input
			class="input"
			type="text"
			name="address"
			placeholder="Adresse"
			aria-invalid={$errors.address ? 'true' : undefined}
			bind:value={$form.address}
		/>
		{#if $errors.address}<p class="text-error-500-400-token">{$errors.address}</p>{/if}
	</label>

	<div class="flex flex-col-reverse sm:flex-row justify-end gap-4 sm:gap-2">
		<a href="/app/customers" class="btn btn-md mr-2 variant-ghost-error">Abbrechen</a>
		<button type="submit" class="btn btn-md mr-2 variant-ghost-primary">Kunde hinzufügen</button>
	</div>
</form>
