<script lang="ts">
	import { signInWithGoogle } from '$lib/clients/authClient';
	import 'iconify-icon';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	async function logInWithGoogle() {
		await signInWithGoogle(supabase);
	}
</script>

<main class="h-screen flex flex-col justify-center items-center space-y-4">
	<h1 class="h1"><span class="gradient-heading">Physio Praxis</span></h1>
	<hr class="w-1/5" />
	<button type="button" class="btn variant-ghost-tertiary items-center" on:click={logInWithGoogle}>
		<iconify-icon class="text-2xl" icon="logos:google-icon" observer="false" />
		<span>Mit Google fortfahren</span>
	</button>
</main>
