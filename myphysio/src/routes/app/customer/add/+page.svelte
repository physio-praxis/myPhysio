<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import type { FormPayload, FormType } from '$lib/types/formTypes';
	import { IdCard, Mail, MapPinHouse, Phone, LoaderCircle, Save } from '@lucide/svelte';

	const { data, form }: { data: FormPayload; form?: FormType } = $props();
	const unifiedForm = $derived(form ?? data.form ?? {});
	const values = $derived(unifiedForm?.values ?? {});
	const errors = $derived(unifiedForm?.errors ?? {});

	let isPending = $state(false);

	let crumbs = [
		{ href: '/app/customer', label: 'Kunde' },
		{ href: '/app/customer/add', label: 'Neuen Kunden hinzufügen' }
	];
</script>

<Breadcrumb items={crumbs} />
<section class="flex flex-col space-y-6">
	<h3 class="text-center h3">Neue Kunde</h3>
	<form
		method="POST"
		action="?/create"
		class="flex flex-col items-center space-y-4"
		use:enhance={() => {
			isPending = true;
			return async ({ result }) => {
				isPending = false;

				if (result.type === 'redirect') {
					goto(resolve(result.location, {}), { replaceState: true });
					return;
				}

				await applyAction(result);
			};
		}}
	>
		{#if errors._global}
			<div
				class="w-full max-w-lg rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700"
			>
				{errors._global}
			</div>
		{/if}

		<!-- Name -->
		<div class="input-group w-full max-w-lg grid-cols-[auto_1fr]">
			<div class="ig-cell preset-tonal">
				<IdCard />
			</div>
			<input
				class="ig-input"
				type="text"
				name="name"
				placeholder="Name"
				required
				value={values.name ?? ''}
				aria-invalid={Boolean(errors.name)}
				aria-describedby="err-name"
			/>
		</div>
		{#if errors.name}
			<p id="err-name" class="w-full max-w-lg text-xs text-red-600">{errors.name}</p>
		{/if}

		<!-- Email -->
		<div class="input-group w-full max-w-lg grid-cols-[auto_1fr]">
			<div class="ig-cell preset-tonal">
				<Mail />
			</div>
			<input
				class="ig-input"
				type="email"
				name="email"
				placeholder="E-mail"
				value={values.email ?? ''}
				aria-invalid={Boolean(errors.email)}
				aria-describedby="err-email"
			/>
		</div>
		{#if errors.email}
			<p id="err-email" class="w-full max-w-lg text-xs text-red-600">{errors.email}</p>
		{/if}

		<!-- Phone Number -->
		<div class="input-group w-full max-w-lg grid-cols-[auto_1fr]">
			<div class="ig-cell preset-tonal">
				<Phone />
			</div>
			<input
				class="ig-input"
				type="tel"
				name="phone"
				placeholder="Telefonnummer"
				value={values.phone ?? ''}
				aria-invalid={Boolean(errors.phone)}
				aria-describedby="err-phone"
			/>
		</div>
		{#if errors.phone}
			<p id="err-phone" class="w-full max-w-lg text-xs text-red-600">{errors.phone}</p>
		{/if}

		<!-- Address -->
		<div class="input-group w-full max-w-lg grid-cols-[auto_1fr]">
			<div class="ig-cell preset-tonal">
				<MapPinHouse />
			</div>
			<input
				class="ig-input"
				type="text"
				name="address"
				placeholder="Adresse"
				value={values.address ?? ''}
				aria-invalid={Boolean(errors.address)}
				aria-describedby="err-address"
			/>
		</div>
		{#if errors.address}
			<p id="err-address" class="w-full max-w-lg text-xs text-red-600">{errors.address}</p>
		{/if}

		<div class="flex w-full max-w-lg justify-end space-x-2">
			<a href={resolve('/app/customer', {})} class="btn preset-filled-error-500">Abbrechen</a>
			<button
				type="submit"
				class="btn flex items-center preset-filled-success-500"
				disabled={isPending}
			>
				{#if isPending}
					<LoaderCircle class="animate-spin" size="20" />
				{:else}
					<Save size="20" />
				{/if}
				Speichern
			</button>
		</div>
	</form>
</section>
