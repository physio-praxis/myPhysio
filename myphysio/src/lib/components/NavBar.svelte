<script lang="ts">
    import { Navigation } from '@skeletonlabs/skeleton-svelte';
    import { Calendar, User, ReceiptEuro, Stethoscope, Settings, LogOut } from '@lucide/svelte';
    import { page } from '$app/state';
	  import { isMobile } from '$lib/stores/breakpoint';

    let value = $state('Kalendar');

    const navInfo = [
      { label: 'Kalendar', href: '/app/calendar', icon: Calendar },
      { label: 'Kunde', href: '/app/customer', icon: User },
      { label: 'Rechnung', href: '/app/bill', icon: ReceiptEuro },
      { label: 'Behandlung', href: '/app/treatment', icon: Stethoscope },
      { label: 'Einstellungen', href: '/app/settings', icon: Settings, classes:'mt-auto' }
    ];
    const navFooterInfo = [
      { label: 'Abmelden', href: '/auth/logout', icon: LogOut }
    ];
</script>

{#if $isMobile}
  <Navigation.Bar {value} onValueChange={(newValue) => (value = newValue)}>
    {#each navInfo as {label, href, icon}}
    {@const Icon = icon}
    <Navigation.Tile id={label} label={label} {href} title={label} selected={page.url.pathname.startsWith(href)}>
      <Icon />
    </Navigation.Tile>
    {/each}
  </Navigation.Bar>
{:else}
 <Navigation.Rail expanded={true} widthExpanded="w-48" tilesJustify="start" footerClasses="hr">
  {#snippet tiles()}
    {#each navInfo as {label, href, icon, classes}}
    {@const Icon = icon}
    <Navigation.Tile labelExpanded={label} {href} title={label} selected={page.url.pathname.startsWith(href)} expandedClasses={classes}>
      <Icon />
    </Navigation.Tile>
    {/each}
  {/snippet}
  {#snippet footer()}
    {#each navFooterInfo as {label, href, icon}}
    {@const Icon = icon}
    <Navigation.Tile labelExpanded={label} {href} title={label} selected={page.url.pathname.startsWith(href)}>
      <Icon />
    </Navigation.Tile>
    {/each}
  {/snippet}
  </Navigation.Rail>
{/if}