<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Crumb } from '$lib/types/navigationTypes';

	let { items }: { items: Crumb[] } = $props();
</script>

<nav aria-label="Breadcrumb" class="mb-4">
	<ol class="text-gray-100-900 flex flex-wrap items-center gap-2 text-sm">
		{#each items as crumb, index (crumb.href)}
			<li class="flex items-center gap-2">
				{#if index > 0}<span class="opacity-60">/</span>{/if}
				{#if index < items.length - 1}
					<a href={resolve(crumb.href, {})} class="anchor">{crumb.label}</a>
				{:else}
					<span class="text-gray-100-900 font-medium opacity-60">{crumb.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
