<script lang="ts">
	import type { HeadTags } from '$lib/types/classes';

	export let headTags: HeadTags;
</script>

<svelte:head>
	<title>{headTags.title}</title>
	<meta name="description" content={headTags.description} />
	{#if headTags.ogTag}
		<meta property="og:title" content={headTags.ogTag.title} />
		<meta property="og:description" content={headTags.ogTag.description} />
		<meta property="og:image" content={headTags.ogTag.image} />
		<meta property="og:url" content={headTags.ogTag.url} />
	{/if}
	{#if headTags.tcTag}
		<meta name="twitter:title" content={headTags.tcTag.title} />
		<meta name="twitter:description" content={headTags.tcTag.description} />
		<meta name="twitter:image" content={headTags.tcTag.image} />
		<meta name="twitter:card" content={headTags.tcTag.Card} />
	{/if}
	<meta name="viewport" content={headTags.viewport} />
	<meta charset={headTags.charset} />
	<link rel="icon" href={headTags.icon} />
</svelte:head>
