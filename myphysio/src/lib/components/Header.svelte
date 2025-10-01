<script lang="ts">
	import favIconUrl from '$lib/assets/favicon.svg';
	import { isMobile } from '$lib/stores/breakpoint';
	import { page } from '$app/state';

	const germanPageNames = [
		{ english: 'calendar', german: 'Kalendar' },
		{ english: 'customer', german: 'Kunde' },
		{ english: 'invoice', german: 'Rechnung' },
		{ english: 'treatment', german: 'Behandlung' },
		{ english: 'settings', german: 'Einstellungen' }
	];
	let path = $derived(page.url.pathname.split('/')[2] ?? 'MyPhysio');
	let pageTitle = $derived(
		germanPageNames.find((item) => item.english === path)?.german ?? 'MyPhysio'
	);
</script>

{#if $isMobile}
	<header class="flex w-full items-center bg-surface-100-900 p-4">
		<div class="flex items-center justify-start space-x-4">
			<img src={favIconUrl} alt="Logo" class="h-10 w-10" />
		</div>
		<h1 class="absolute left-1/2 ml-4 -translate-x-1/2 h1">{pageTitle}</h1>
	</header>
{:else}
	<header class="flex w-full items-center bg-surface-100-900 p-4">
		<div class="flex items-center justify-start space-x-4">
			<img src={favIconUrl} alt="Logo" class="h-10 w-10" />
			<h2 class="h2"><span class="text-primary-500">My</span>Physio</h2>
		</div>
		<h1 class="absolute left-1/2 ml-24 -translate-x-1/2 h1">{pageTitle}</h1>
	</header>
{/if}
