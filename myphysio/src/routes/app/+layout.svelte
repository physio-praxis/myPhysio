<script lang="ts">
    import favIconUrl from '$lib/assets/favicon.svg';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<div class="grid h-screen grid-rows-[auto_1fr]">
  <header class="p-4 flex justify-center items-center bg-surface-100-900">
    <div class="flex items-center justify-center space-x-4">
      <img src={favIconUrl} alt="Logo" class="w-10 h-10" />
      <h2 class="h2"><span class="text-primary-500">My</span>Physio</h2>
    </div>
  </header>

  <div class="grid min-h-0 md:grid-cols-[auto_1fr]">
    <aside class="fixed inset-x-0 bottom-0 z-20 md:static">
      <NavBar />
    </aside>

    <main class="order-1 md:order-2 p-4 min-h-0 overflow-auto pb-16 md:pb-0">
      <slot />
    </main>
  </div>
</div>
