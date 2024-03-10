import { PUBLIC_AUTH_REDIRECT_URL } from '$env/static/public';
import type { Database } from '$lib/gen/supabase';
import type { SignInWithOAuthCredentials, SupabaseClient } from "@supabase/supabase-js";

export async function signInWithGoogle(supabase: SupabaseClient) {
    const credentials: SignInWithOAuthCredentials = {
        provider: 'google',
        options: {
            redirectTo: PUBLIC_AUTH_REDIRECT_URL,
            scopes: 'profile email',
            skipBrowserRedirect: false,
        }
    }
    const {data, error} = await supabase.auth.signInWithOAuth(credentials);
    
    if (error) throw error;
    return { data };
}

export async function isUserAllowed(supabase: SupabaseClient<Database>, email: string|undefined): Promise<boolean> {
    if(!email) return false;
    
    const { data, error } = await supabase
        .from('allowed_users')
        .select()
        .eq('email', email)
        .single();
    console.log(data);
    if (error) return false;
    return data != null;
}