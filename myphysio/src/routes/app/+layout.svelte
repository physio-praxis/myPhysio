<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<div class="grid h-screen grid-rows-[auto_1fr]">
  <Header />

  <div class="grid min-h-0 md:grid-cols-[auto_1fr]">
    <aside class="fixed inset-x-0 bottom-0 z-20 md:static">
      <NavBar />
    </aside>

    <main class="order-1 md:order-2 p-4 min-h-0 overflow-auto pb-16 md:pb-0">
      <slot />
    </main>
  </div>
</div>
