<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import type { FormPayload, FormType } from '$lib/types/formTypes';
	import {
		IdCard,
		Mail,
		Phone,
		LoaderCircle,
		Save,
		FileUp,
		Paperclip,
		CircleX,
		Route,
		MapPinPlus,
		Mailbox,
		Building2,
		Earth
	} from '@lucide/svelte';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';

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
		enctype="multipart/form-data"
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

		<!-- firstName -->
		<div class="input-group w-full max-w-lg grid-cols-[auto_1fr]">
			<div class="ig-cell preset-tonal">
				<IdCard />
			</div>
			<input
				class="ig-input"
				type="text"
				name="firstName"
				placeholder="Vorname"
				required
				value={values.name ?? ''}
				aria-invalid={Boolean(errors.firstName)}
				aria-describedby="err-firstName"
			/>
		</div>
		{#if errors.firstName}
			<p id="err-firstName" class="w-full max-w-lg text-xs text-red-600">{errors.firstName}</p>
		{/if}

		<!-- lastName -->
		<div class="input-group w-full max-w-lg grid-cols-[auto_1fr]">
			<div class="ig-cell preset-tonal">
				<IdCard />
			</div>
			<input
				class="ig-input"
				type="text"
				name="lastName"
				placeholder="Nachname"
				required
				value={values.lastName ?? ''}
				aria-invalid={Boolean(errors.lastName)}
				aria-describedby="err-lastName"
			/>
		</div>
		{#if errors.lastName}
			<p id="err-lastName" class="w-full max-w-lg text-xs text-red-600">{errors.lastName}</p>
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

		<!-- Street -->
		<div class="input-group w-full max-w-lg grid-cols-[auto_1fr]">
			<div class="ig-cell preset-tonal">
				<Route />
			</div>
			<input
				class="ig-input"
				type="text"
				name="street"
				placeholder="Straße und Hausnummer"
				value={values.street ?? ''}
				aria-invalid={Boolean(errors.street)}
				aria-describedby="err-street"
			/>
		</div>
		{#if errors.street}
			<p id="err-street" class="w-full max-w-lg text-xs text-red-600">{errors.street}</p>
		{/if}

		<!-- Additional Address -->
		<div class="input-group w-full max-w-lg grid-cols-[auto_1fr]">
			<div class="ig-cell preset-tonal">
				<MapPinPlus />
			</div>
			<input
				class="ig-input"
				type="text"
				name="additionalAddress"
				placeholder="Zusatz (Wohnung, Etage, etc..)"
				value={values.additionalAddress ?? ''}
				aria-invalid={Boolean(errors.additionalAddress)}
				aria-describedby="err-additionalAddress"
			/>
		</div>
		{#if errors.additionalAddress}
			<p id="err-additionalAddress" class="w-full max-w-lg text-xs text-red-600">
				{errors.additionalAddress}
			</p>
		{/if}

		<!-- City and Postal Code -->
		<div class="grid w-full max-w-lg grid-cols-[2fr_1fr] gap-2">
			<div class="input-group grid-cols-[auto_1fr]">
				<div class="ig-cell preset-tonal">
					<Building2 />
				</div>
				<input
					class="ig-input"
					type="text"
					name="city"
					placeholder="Stadt"
					value={values.city ?? ''}
					aria-invalid={Boolean(errors.city)}
					aria-describedby="err-city"
				/>
			</div>
			<div class="input-group grid-cols-[1fr] md:grid-cols-[auto_1fr]">
				<div class="ig-cell hidden preset-tonal md:flex md:items-center md:justify-center">
					<Mailbox />
				</div>
				<input
					class="ig-input"
					type="text"
					name="postalCode"
					placeholder="PLZ"
					value={values.postalCode ?? ''}
					aria-invalid={Boolean(errors.postalCode)}
					aria-describedby="err-postalCode"
				/>
			</div>
			{#if errors.city || errors.postalCode}
				<div class="grid w-full max-w-lg grid-cols-[2fr_1fr] gap-2">
					{#if errors.city}
						<p id="err-city" class="text-xs text-red-600">
							{errors.city}
						</p>
					{/if}
					{#if errors.postalCode}
						<p id="err-postalCode" class="text-xs text-red-600">
							{errors.postalCode}
						</p>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Country -->
		<div class="input-group w-full max-w-lg grid-cols-[auto_1fr]">
			<div class="ig-cell preset-tonal">
				<Earth />
			</div>
			<input
				class="ig-input"
				type="text"
				name="country"
				placeholder="Land"
				value={values.country ?? ''}
				aria-invalid={Boolean(errors.country)}
				aria-describedby="err-country"
			/>
		</div>
		{#if errors.country}
			<p id="err-country" class="w-full max-w-lg text-xs text-red-600">{errors.country}</p>
		{/if}

		<!-- Consent File -->
		<div class="w-full max-w-lg">
			<FileUpload
				name="consent"
				maxFiles={1}
				subtext="DSGVO-Datei anhängen."
				classes="w-full"
				label="DSGVO Datei Upload"
				allowDrop
				invalid={Boolean(errors.consent)}
			>
				{#snippet iconInterface()}<FileUp class="size-8" />{/snippet}
				{#snippet iconFile()}<Paperclip class="size-4" />{/snippet}
				{#snippet iconFileRemove()}<CircleX class="size-4" />{/snippet}
			</FileUpload>
		</div>
		{#if errors.consent}
			<p id="err-consent" class="w-full max-w-lg text-xs text-red-600">{errors.consent}</p>
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
