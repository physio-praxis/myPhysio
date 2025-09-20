<script lang="ts">
	import 'iconify-icon';
	import { Avatar, Navigation } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<AppShell regionPage="h-screen">
	{#snippet sidebarLeft()}
	
			<Navigation class="h-full">
				<AppRailAnchor
					href="/app/user"
					title="Benutzer"
					selected={page.url.pathname === '/app/user'}
				>
					{#snippet lead()}
							
							<Avatar initials="MH" background="bg-tertiary-500" />
						
							{/snippet}
				</AppRailAnchor>
				<AppRailAnchor
					href="/app/calendar"
					title="Kalender"
					selected={page.url.pathname.includes('/app/calendar')}
				>
					{#snippet lead()}
							
							<iconify-icon class="text-2xl" icon="mdi:calendar" observer="false"></iconify-icon>
						
							{/snippet}
					<span>Kalender</span>
				</AppRailAnchor>
				<AppRailAnchor
					href="/app/customers"
					title="Kunden"
					selected={page.url.pathname.includes('/app/customers')}
				>
					{#snippet lead()}
							
							<iconify-icon class="text-2xl" icon="mdi:clipboard-person" observer="false"></iconify-icon>
						
							{/snippet}
					<span>Kunde</span>
				</AppRailAnchor>
				<AppRailAnchor
					href="/app/invoices"
					title="Rechnungen"
					selected={page.url.pathname.includes('/app/invoices')}
				>
					{#snippet lead()}
							
							<iconify-icon class="text-2xl" icon="mdi:invoice-text" observer="false"></iconify-icon>
						
							{/snippet}
					<span>Rechnung</span>
				</AppRailAnchor>
				<AppRailAnchor
					href="/app/treatments"
					title="Behandlungen"
					selected={page.url.pathname.includes('/app/treatments')}
				>
					{#snippet lead()}
							
							<iconify-icon class="text-2xl" icon="mdi:medical-bag" observer="false"></iconify-icon>
						
							{/snippet}
					<span>Behandlung</span>
				</AppRailAnchor>
				{#snippet trail()}
					
						<AppRailAnchor href="/auth/logout" title="Ausloggen">
							{#snippet lead()}
									
									<iconify-icon class="text-2xl" icon="mdi:logout" observer="false"></iconify-icon>
								
									{/snippet}
							<span>Ausloggen</span>
						</AppRailAnchor>
					
					{/snippet}
			</Navigation>
		
	{/snippet}
	<main class="space-y-4 p-4 flex flex-col items-center h-full">
		{@render children?.()}
	</main>
</AppShell>
