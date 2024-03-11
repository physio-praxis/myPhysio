<script lang="ts">
	import 'iconify-icon';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<main class="h-screen flex flex-col justify-center items-center space-y-6">
	<h1 class="h1"><span class="gradient-heading">Physio Praxis</span></h1>
	<hr class="w-1/5" />
	<form class="flex flex-col space-y-4 sm:min-w-96" method="POST">
		{#if form?.missing}<p class="text-error-500-400-token">*E-Mail ist erforderlich</p>{/if}
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">
				<iconify-icon class="text-2xl" icon="mdi:email" observer="false" />
			</div>
			<input
				class="input rounded-l-none"
				name="email"
				title="email"
				type="email"
				placeholder="Email"
				autocomplete="email"
			/>
		</div>

		{#if form?.pass_missing}<p class="text-error-500-400-token">*Passwort ist erforderlich</p>{/if}
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">
				<iconify-icon class="text-2xl" icon="mdi:form-textbox-password" observer="false" />
			</div>
			<input
				class="input rounded-l-none"
				name="password"
				title="password"
				type="password"
				placeholder="Passwort"
			/>
		</div>
		<button class="btn variant-filled-primary">Anmelden</button>
		{#if form?.login_failed}
			<p class="text-error-500-400-token">Die E-Mail-Adresse oder das Passwort ist inkorrekt</p>
			<p class="text-error-500-400-token">
				oder Sie sind nicht autorisiert, diese App zu verwenden!
			</p>
		{/if}
	</form>
</main>
