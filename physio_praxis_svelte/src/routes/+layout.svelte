<script lang="ts">
	import '../app.postcss';

	import { Toaster } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/components/skeleton/toaster';

	// modals

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<Toaster {toaster}></Toaster>
{@render children?.()}
