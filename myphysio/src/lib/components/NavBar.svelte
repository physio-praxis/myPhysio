<script lang="ts">
    import { Navigation } from '@skeletonlabs/skeleton-svelte';
    const mdScreenSize = 767;
    let windowInnerWidth: number = $state(0);

    $inspect(windowInnerWidth);
</script>
<svelte:window bind:innerWidth={windowInnerWidth}/>

{#if windowInnerWidth > mdScreenSize}
    <Navigation.Rail expanded={true}>
    {#snippet tiles()}
      <Navigation.Tile labelExpanded="Browse Files" href="#/files">
      </Navigation.Tile>
      <Navigation.Tile labelExpanded="Browse Images" href="#/images">
      </Navigation.Tile>
      <Navigation.Tile labelExpanded="Browse Music" href="#/music">
      </Navigation.Tile>
      <Navigation.Tile labelExpanded="Browse Videos" href="#/videos">
      </Navigation.Tile>
      <Navigation.Tile labelExpanded="Browse Games" href="/games">
      </Navigation.Tile>
    {/snippet}
    {#snippet footer()}
        <Navigation.Tile labelExpanded="Settings" href="/settings" title="Settings">
        </Navigation.Tile>
    {/snippet}
  </Navigation.Rail>
{:else}
test
{/if}