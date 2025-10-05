<script lang="ts">
	import type { CustomerSearchItem } from '$lib/types/customerSearch';
	import { ShieldX, ShieldCheck, Mail, Phone, PawPrint, MapPinHouse } from '@lucide/svelte';
	interface Props {
		customerSearchItem: CustomerSearchItem;
	}
	let { customerSearchItem }: Props = $props();
</script>

<article
	class="flex w-full flex-col space-y-2 card border-2 border-surface-200-800 preset-filled-surface-100-900 p-4"
>
	<header class="mb-4 flex justify-between">
		<h4 class="h4">{customerSearchItem.customer.name ?? '---'}</h4>
		{#if customerSearchItem.badges.hasConcent}
			<span class="text-success-500">
				<ShieldCheck />
			</span>
		{:else}
			<span class="text-error-500">
				<ShieldX />
			</span>
		{/if}
	</header>

	<item class="flex items-center space-x-2">
		<Mail size="20" />
		<span>{customerSearchItem.customer.email ?? '---'}</span>
	</item>

	<item class="flex items-center space-x-2">
		<Phone size="20" />
		<span>{customerSearchItem.customer.phoneNumber ?? '---'}</span>
	</item>

	<item class="flex items-center space-x-2">
		<MapPinHouse size="20" />
		<span>{customerSearchItem.customer.address ?? '---'}</span>
	</item>

	<hr class="mb-4" />
	<h5 class="h5">Haustiere</h5>

	<item class="flex items-center space-x-2">
		<PawPrint size="18" />
		<span>{customerSearchItem.petsLine}</span>
	</item>
</article>
