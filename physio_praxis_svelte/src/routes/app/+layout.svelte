<script lang="ts">
	import 'iconify-icon';
	import { AppRail, AppRailAnchor, AppShell, Avatar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
</script>

<AppShell>
	<svelte:fragment slot="sidebarLeft">
		<AppRail class="h-screen">
			<AppRailAnchor
				href="/app/user"
				title="Benutzer"
				selected={$page.url.pathname === '/app/user'}
			>
				<svelte:fragment slot="lead">
					<Avatar initials="MH" background="bg-tertiary-500" />
				</svelte:fragment>
			</AppRailAnchor>
			<AppRailAnchor
				href="/app/calendar"
				title="Kalender"
				selected={$page.url.pathname === '/app/calendar'}
			>
				<svelte:fragment slot="lead">
					<iconify-icon class="text-2xl" icon="mdi:calendar" observer="false" />
				</svelte:fragment>
				<span>Kalender</span>
			</AppRailAnchor>
			<AppRailAnchor
				href="/app/customers"
				title="Kunden"
				selected={$page.url.pathname === '/app/customers'}
			>
				<svelte:fragment slot="lead">
					<iconify-icon class="text-2xl" icon="mdi:clipboard-person" observer="false" />
				</svelte:fragment>
				<span>Kunde</span>
			</AppRailAnchor>
			<AppRailAnchor
				href="/app/invoices"
				title="Rechnungen"
				selected={$page.url.pathname === '/app/invoices'}
			>
				<svelte:fragment slot="lead">
					<iconify-icon class="text-2xl" icon="mdi:invoice-text" observer="false" />
				</svelte:fragment>
				<span>Rechnung</span>
			</AppRailAnchor>
			<AppRailAnchor
				href="/app/treatments"
				title="Behandlungen"
				selected={$page.url.pathname === '/app/treatments'}
			>
				<svelte:fragment slot="lead">
					<iconify-icon class="text-2xl" icon="mdi:medical-bag" observer="false" />
				</svelte:fragment>
				<span>Behandlung</span>
			</AppRailAnchor>
			<svelte:fragment slot="trail">
				<AppRailAnchor href="/auth/logout" title="Ausloggen">
					<svelte:fragment slot="lead">
						<iconify-icon class="text-2xl" icon="mdi:logout" observer="false" />
					</svelte:fragment>
					<span>Ausloggen</span>
				</AppRailAnchor>
			</svelte:fragment>
		</AppRail>
	</svelte:fragment>
	<slot />
</AppShell>
