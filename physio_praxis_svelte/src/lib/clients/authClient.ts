import type { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import { AUTH_REDIRECT_URL } from '$env/static/private';
import type { allowed_users } from "$lib/types/types";

export async function signInWithGoogle() {
    const credentials: SignInWithOAuthCredentials = {
        provider: 'google',
        options: {
            redirectTo: AUTH_REDIRECT_URL,
            scopes: 'profile email',
            skipBrowserRedirect: false,
        }
    }
    const {data, error} = await supabase.auth.signInWithOAuth(credentials);
    
    if (error) throw error;
    return { data };
}

export async function isUserAllowed(email: string): Promise<allowed_users> {
    const { data, error } = await supabase
        .from('allowed_users')
        .select()
        .eq('email', email)
        .single();
    if (error) throw error;
    return data;
}