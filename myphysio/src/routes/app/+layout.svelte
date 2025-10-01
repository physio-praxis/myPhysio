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

		<main class="order-1 min-h-0 overflow-auto p-4 pb-16 md:order-2 md:pb-0">
			<slot />
		</main>
	</div>
</div>
