import { clearSessionCookie, invalidateSession, SESSION_COOKIE_NAME } from "$lib/server/session";
import { redirect, type Cookies } from "@sveltejs/kit";

async function doLogout(cookies: Cookies) {
    const token = cookies.get(SESSION_COOKIE_NAME);
    if (token) await invalidateSession(token);
    clearSessionCookie(cookies);
    return redirect(303, '/auth/login');
}

export const GET = async ({ cookies }) => doLogout(cookies);