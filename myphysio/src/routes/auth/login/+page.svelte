<script lang="ts">
    import favIconUrl from '$lib/assets/favicon.svg';

    export let form: { values?: { email?: string }; errors?: Record<string, string> } | undefined;

    let email = form?.values?.email ?? "";
    let password = "";
</script>

<main class="h-screen flex flex-col justify-center items-center p-4 gap-8">
    <!-- Title & greeting -->
    <section class="flex flex-col gap-2">
        <!-- Title & logo -->
        <div class="flex items-center justify-center">
            <!-- logo -->
            <img src={favIconUrl} alt="Logo" class="w-10 h-10" />
            <!-- title -->
            <h1 class="h1">MyPhysio</h1>
        </div>
        <!-- greeting small screens -->
        <span class="block md:hidden">Willkommen zurück, bitte anmelden.</span>
        <!-- greeting medium - large screens -->
        <span class="hidden md:block">Willkommen zurück, bitte melden Sie sich bei Ihrem Konto an.</span>
    </section>
    <!-- Login Card -->
    <section class="card p-10 preset-filled-surface-100-900 w-full md:max-w-md">
        <!-- form -->
        <form method="POST" class="mx-auto w-full max-w-md space-y-4">
            <!-- email -->
            <label class="label">
                <span class="label-text">E-mail</span>
                <input type="email" name="email" class="input" placeholder="john.doe@example.com" bind:value={email} autocomplete="email" required/>
                {#if form?.errors?.email}<p class="text-error-500">{form.errors.email}</p>{/if}
            </label>
            <!-- password -->
            <label class="label">
                <span class="label-text">Passwort</span>
                <input type="password" name="password" class="input" placeholder="******" bind:value={password} autocomplete="current-password" minlength="6" required/>
            </label>

            <button type="submit" class="btn preset-filled-primary-200-800 w-full mt-2">Anmelden</button>

            {#if form?.errors?._form}
                <p class="text-error-500">{form.errors._form}</p>
            {/if}
        </form>
    </section>
</main>