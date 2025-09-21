import { createSessionForUserId, ensureAuthUser, setSessionCookie } from '$lib/server/session';
import { supabaseAdmin, supabaseAnonServer } from '$lib/server/supabase';
import { loginSchema } from '$lib/validation/auth/login';
import { zodToErrors } from '$lib/validation/helpers';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const values = {
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? "")
        };

        // validation
        const parsed = loginSchema.safeParse(values);
        if (!parsed.success) {
            return fail(400, { values: { email: values.email }, errors: zodToErrors(parsed.error)});
        }

        // Sign in to Supabase using anon key (server-side)
        const { data, error } = await supabaseAnonServer.auth.signInWithPassword({
            email: parsed.data.email,
            password: parsed.data.password
        });

        if (error || !data?.session?.access_token) {
            return fail(400, {
                values: { email: values.email },
                errors: { _form: "Ungültige E-Mail-Adresse oder falsches Passwort." }
            });
        }
        const access_token = data.session.access_token;

        // verify token and fetch user
        const { data: userResult, error: userError } = await supabaseAdmin.auth.getUser(access_token);
        if (userError || !userResult?.user) {
            return fail(401, { values: { email: values.email }, errors: { _form: "Anmeldung fehlgeschlagen. Wenden Sie sich an den Administrator."} });
        }

        // create session
        const user = userResult.user;
        const userId = user.id;
        await ensureAuthUser({ id: userId, email: user.email ?? null });
        const session = await createSessionForUserId(userId);
        setSessionCookie(cookies, session);

        // redirect to app
        return redirect(303, "/");
    }
};