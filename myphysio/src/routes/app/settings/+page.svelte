<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { isMobile } from '$lib/stores/breakpoint';

	function logout() {
		goto(resolve('/auth/logout'));
	}
</script>

<section class="flex h-full flex-col items-center pb-6">
	{#if $isMobile}
		<button on:click={logout} class="mt-auto btn w-full preset-filled-error-500 py-2">
			Abmelden
		</button>
	{/if}
</section>
