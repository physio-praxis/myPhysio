<script lang="ts">
	import { PawPrint } from '@lucide/svelte';

	let { size = 30 }: { size?: number } = $props();
</script>

<div
	class="mt-4 flex items-center justify-center gap-2 text-neutral-300"
	role="status"
	aria-live="polite"
	aria-busy="true"
>
	<PawPrint class="animate-spin" aria-hidden="true" {size} />
</div>
