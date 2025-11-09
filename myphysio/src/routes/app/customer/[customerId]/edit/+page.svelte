<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import type { CustomerDetails } from '$lib/types/customerTypes';
	import type { FormType } from '$lib/types/formTypes';
	import type { Crumb } from '$lib/types/navigationTypes';
	import {
		IdCard,
		Mail,
		MapPinHouse,
		Phone,
		LoaderCircle,
		Save,
		FileUp,
		Paperclip,
		CircleX,
		CircleCheck
	} from '@lucide/svelte';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';

	interface Data {
		customer: CustomerDetails;
		breadCrumb: Crumb[];
		form: FormType;
	}

	let { data, form }: { data: Data; form?: FormType } = $props();
	let customer = data.customer;
	let breadCrumb = data.breadCrumb;

	let isPending = $state(false);
	const unifiedForm = $derived(form ?? data.form ?? {});
	const values = $derived(unifiedForm?.values ?? {});
	const errors = $derived(unifiedForm?.errors ?? {});
</script>

<Breadcrumb items={breadCrumb} />
<section class="flex flex-col space-y-6">
	<h3 class="text-center h3">Kunden bearbeiten</h3>

	<form
		method="POST"
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
		<!-- Global Error -->
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
				value={values.firstName ?? customer.firstName ?? ''}
				aria-invalid={Boolean(errors['firstName'])}
				aria-describedby="err-firstName"
			/>
		</div>
		{#if errors['firstName']}
			<p id="err-firstName" class="w-full max-w-lg text-xs text-red-600">{errors['firstName']}</p>
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
				value={values.lastName ?? customer.lastName ?? ''}
				aria-invalid={Boolean(errors['lastName'])}
				aria-describedby="err-lastName"
			/>
		</div>
		{#if errors['lastName']}
			<p id="err-lastName" class="w-full max-w-lg text-xs text-red-600">{errors['lastName']}</p>
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
				value={values.email ?? customer.email ?? ''}
				aria-invalid={Boolean(errors['email'])}
				aria-describedby="err-email"
			/>
		</div>
		{#if errors['email']}
			<p id="err-email" class="w-full max-w-lg text-xs text-red-600">{errors['email']}</p>
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
				value={values.phone ?? customer.phoneNumber ?? ''}
				aria-invalid={Boolean(errors['phone'])}
				aria-describedby="err-phone"
			/>
		</div>
		{#if errors['phone']}
			<p id="err-phone" class="w-full max-w-lg text-xs text-red-600">{errors['phone']}</p>
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
				value={values.address ?? customer.address ?? ''}
				aria-invalid={Boolean(errors['address'])}
				aria-describedby="err-address"
			/>
		</div>
		{#if errors['address']}
			<p id="err-address" class="w-full max-w-lg text-xs text-red-600">{errors['address']}</p>
		{/if}

		<!-- Current Consent File Info -->
		{#if customer.hasConsent}
			<div class="w-full max-w-lg rounded-lg border border-success-300 bg-success-50 p-3">
				<div class="flex items-center space-x-2 text-sm text-success-700">
					<CircleCheck class="size-4" />
					<span>
						Aktuelle Einwilligungsdatei: <strong>{customer.consentFilename}</strong>
					</span>
				</div>
				{#if customer.consentUploadedAt}
					<p class="ml-6 text-xs text-success-600">
						Hochgeladen am: {new Date(customer.consentUploadedAt).toLocaleDateString('de-DE')}
					</p>
				{/if}
			</div>
		{/if}

		<!-- Consent File Upload (Optional) -->
		<div class="w-full max-w-lg">
			<FileUpload
				name="consentFile"
				maxFiles={1}
				subtext={customer.hasConsent
					? 'Neue Datei hochladen, um die aktuelle zu ersetzen (optional).'
					: 'DSGVO-Datei anhängen (optional).'}
				classes="w-full"
				label="DSGVO Datei Upload"
				allowDrop
				invalid={Boolean(errors['consentFile'])}
			>
				{#snippet iconInterface()}<FileUp class="size-8" />{/snippet}
				{#snippet iconFile()}<Paperclip class="size-4" />{/snippet}
				{#snippet iconFileRemove()}<CircleX class="size-4" />{/snippet}
			</FileUpload>
		</div>
		{#if errors['consentFile']}
			<p id="err-consentFile" class="w-full max-w-lg text-xs text-red-600">
				{errors['consentFile']}
			</p>
		{/if}

		<!-- Action Buttons -->
		<div class="flex w-full max-w-lg justify-end space-x-2">
			<a
				href={resolve(`/app/customer/${customer.customerId}`, {})}
				class="btn preset-filled-error-500"
			>
				Abbrechen
			</a>
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
