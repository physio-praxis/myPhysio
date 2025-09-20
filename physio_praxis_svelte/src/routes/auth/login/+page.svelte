<script lang="ts">
	import 'iconify-icon';
	import { superForm } from 'sveltekit-superforms';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	const { form, errors, enhance } = superForm(data?.form);
</script>

<main class="h-screen flex flex-col justify-center items-center space-y-6">
	<h1 class="h1"><span class="gradient-heading">Physio Praxis</span></h1>
	<hr class="w-1/5" />
	<form class="flex flex-col space-y-4 sm:min-w-96" method="POST" use:enhance>
		{#if $errors.email}<p class="text-error-600-400">{$errors.email}</p>{/if}
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">
				<iconify-icon class="text-2xl" icon="mdi:email" observer="false"></iconify-icon>
			</div>
			<input
				class="input rounded-l-none"
				name="email"
				title="email"
				type="email"
				placeholder="Email"
				autocomplete="email"
				aria-invalid={$errors.email ? 'true' : undefined}
				bind:value={$form.email}
			/>
		</div>

		{#if $errors.password}<p class="text-error-600-400">{$errors.password}</p>{/if}
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">
				<iconify-icon class="text-2xl" icon="mdi:form-textbox-password" observer="false"></iconify-icon>
			</div>
			<input
				class="input rounded-l-none"
				name="password"
				title="password"
				type="password"
				placeholder="Passwort"
				aria-invalid={$errors.password ? 'true' : undefined}
				bind:value={$form.password}
			/>
		</div>
		<button class="btn preset-filled-primary-500">Anmelden</button>
	</form>
</main>
