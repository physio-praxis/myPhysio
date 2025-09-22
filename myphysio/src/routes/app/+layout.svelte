<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
</script>

<!-- screen -->
<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<!-- header -->
	<header class="p-4 flex justify-center items-center bg-red-600">header</header>
	<!-- screen middle -->
  	<div class="grid grid-rows-[auto_1fr] md:grid-rows-none md:grid-cols-[auto_1fr] min-h-0">
		<!-- Sidebar -->
		<aside class="p-4">
			<NavBar />
		</aside>
		<!-- Main Content -->
		<main class="p-4 bg-green-600">
            <slot />
		</main>
	</div>
</div>
