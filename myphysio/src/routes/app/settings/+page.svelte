<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="flex h-full flex-col items-center pb-6">
	<div class="text-sm">
		Version {data.version}
	</div>
</section>
