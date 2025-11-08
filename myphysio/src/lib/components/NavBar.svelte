<script lang="ts">
	import { Modal, Navigation } from '@skeletonlabs/skeleton-svelte';
	import {
		Calendar,
		User,
		ReceiptEuro,
		Stethoscope,
		Settings,
		LogOut,
		CircleEllipsis
	} from '@lucide/svelte';
	import { page } from '$app/state';

	let navBarValue = $state('Kalendar');
	let showMoreDrawer = $state(false);

	const navInfo = [
		{ label: 'Kalendar', href: '/app/calendar', icon: Calendar },
		{ label: 'Kunde', href: '/app/customer', icon: User },
		{ label: 'Rechnung', href: '/app/invoice', icon: ReceiptEuro },
		{ label: 'Behandlung', href: '/app/treatment', icon: Stethoscope },
		{ label: 'Einstellungen', href: '/app/settings', icon: Settings, classes: 'mt-auto' }
	];
	const mobilePrimaryNavItems = navInfo.slice(0, 4);
	const mobileSecondaryNavItems = navInfo.slice(4);
	const navFooterInfo = [{ label: 'Abmelden', href: '/auth/logout', icon: LogOut }];

	function toggleMoreDrawer() {
		showMoreDrawer = !showMoreDrawer;
	}
</script>

<!-- Mobile Navigation (hidden on md and above) -->
<div class="block md:hidden">
	<Navigation.Bar value={navBarValue} onValueChange={(newValue) => (navBarValue = newValue)}>
		{#each mobilePrimaryNavItems as { label, href, icon } (label)}
			{@const Icon = icon}
			<Navigation.Tile
				id={label}
				{href}
				title={label}
				selected={page.url.pathname.startsWith(href)}
			>
				<Icon />
			</Navigation.Tile>
		{/each}
		<!-- More -->
		<Navigation.Tile id="mehr" title="Mehr" onclick={toggleMoreDrawer}>
			<CircleEllipsis />
		</Navigation.Tile>
	</Navigation.Bar>
</div>

<!-- Desktop Navigation (hidden below md) -->
<div class="hidden h-full md:block">

	<!-- Drawer for secondary items -->
	<Modal
		open={showMoreDrawer}
		onOpenChange={(e) => (showMoreDrawer = e.open)}
		contentBase="bg-surface-100-900 p-4 pb-safe space-y-4 shadow-xl w-full h-auto max-h-[70vh] overflow-y-auto rounded-t-xl"
		zIndex="30"
		positionerJustify="justify-end"
		positionerAlign="items-end"
		positionerPadding=""
		backdropClasses="backdrop-blur-sm"
		transitionsPositionerIn={{ y: 500, duration: 200 }}
		transitionsPositionerOut={{ y: 500, duration: 200 }}
	>
		{#snippet content()}
			<header class="flex items-center justify-between">
				<h2 class="text-lg font-semibold">Mehr</h2>
			</header>
			<nav class="space-y-2">
				{#each mobileSecondaryNavItems as { label, href, icon } (label)}
					{@const Icon = icon}
					<a
						{href}
						class="flex items-center gap-3 rounded-lg p-3 hover:bg-surface-200-800"
						class:bg-primary-500={page.url.pathname.startsWith(href)}
						onclick={() => (showMoreDrawer = false)}
					>
						<Icon size={20} />
						<span>{label}</span>
					</a>
				{/each}

				<hr class="my-2" />
				{#each navFooterInfo as { label, href, icon } (label)}
					{@const Icon = icon}
					<a
						{href}
						class="flex items-center gap-3 rounded-lg p-3 hover:bg-surface-200-800"
						class:bg-primary-500={page.url.pathname.startsWith(href)}
						onclick={() => (showMoreDrawer = false)}
					>
						<Icon size={20} />
						<span>{label}</span>
					</a>
				{/each}
			</nav>
		{/snippet}
	</Modal>
{:else}
	<Navigation.Rail expanded={true} widthExpanded="w-48" tilesJustify="start" footerClasses="hr">
		{#snippet tiles()}
			{#each navInfo as { label, href, icon, classes } (label)}
				{@const Icon = icon}
				<Navigation.Tile
					labelExpanded={label}
					{href}
					title={label}
					selected={page.url.pathname.startsWith(href)}
					expandedClasses={classes}
				>
					<Icon />
				</Navigation.Tile>
			{/each}
		{/snippet}
		{#snippet footer()}
			{#each navFooterInfo as { label, href, icon } (label)}
				{@const Icon = icon}
				<Navigation.Tile
					labelExpanded={label}
					{href}
					title={label}
					selected={page.url.pathname.startsWith(href)}
				>
					<Icon />
				</Navigation.Tile>
			{/each}
		{/snippet}
	</Navigation.Rail>
</div>
