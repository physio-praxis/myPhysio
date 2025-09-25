
<script lang="ts">
	import { isMobile } from "$lib/stores/breakpoint";


</script>

<section class="flex flex-col items-center h-full pb-6">
    {#if $isMobile}
        <a href="/auth/logout" class="mt-auto btn preset-filled-error-500 w-full py-2">
            Abmelden
        </a>
    {/if}
</section>