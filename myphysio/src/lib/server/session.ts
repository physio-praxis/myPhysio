import crypto from 'node:crypto';
import { db } from './db/db';
import { authUser, userSession, type InsertAuthUser } from './db/schema';
import type { Cookies } from '@sveltejs/kit';
import { eq } from 'drizzle-orm/expressions';

export const SESSION_COOKIE_NAME = 'myphysio_app_session';
const SESSION_TTL_SECONDS = 604_800; // 7 days
const REFRESH_THRESHOLD_SECONDS = 86_400; // 1 day

export function generateSessionToken(): string {
    return crypto.randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export type SessionRecord = {
    id: string;
    userId: string;
    expiresAt: Date;
};

export async function ensureAuthUser(user: InsertAuthUser) {
    await db.insert(authUser)
        .values({ id: user.id, email: user.email ?? null, supabaseUserId: user.id as unknown as string})
        .onConflictDoUpdate({ target: authUser.id, set: { email: user.email ?? null }});
}

export async function createSessionForUserId(userId: string, ttlSeconds = SESSION_TTL_SECONDS): Promise<SessionRecord> {
    const token = generateSessionToken();
    const idHash = hashToken(token);
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    await db.insert(userSession).values({ id: idHash, userId, expiresAt });
    return { id: token, userId, expiresAt };
}

export function setSessionCookie(cookies: Cookies, session: SessionRecord) {
    cookies.set(SESSION_COOKIE_NAME, session.id, {
        path: '/', httpOnly: true, sameSite: 'lax', secure: !import.meta.env.DEV, expires: session.expiresAt
    });
}

export function clearSessionCookie(cookies: Cookies) {
    cookies.set(SESSION_COOKIE_NAME, '', {
        path: '/', httpOnly: true, sameSite: 'lax', secure: !import.meta.env.DEV, expires: new Date(0)
    });
}

export async function readSession(cookies: Cookies): Promise<SessionRecord | null> {
    const token = cookies.get(SESSION_COOKIE_NAME);
    if (!token) return null;

    const idHash = hashToken(token);
    const rows = await db.select({ userId: userSession.userId, expiresAt: userSession.expiresAt })
        .from(userSession).where(eq(userSession.id, idHash)).limit(1);
    const row = rows[0];
    if (!row) return null;
    if (row.expiresAt <= new Date()) return null;
    return { id: token, userId: row.userId, expiresAt: row.expiresAt };
}

export async function refreshSessionIfNeeded(cookies: Cookies, session: SessionRecord, ttlSeconds = SESSION_TTL_SECONDS) {
    const secondsLeft = (session.expiresAt.getTime() - Date.now()) / 1000;
    if (secondsLeft > REFRESH_THRESHOLD_SECONDS) return session;
    const newExpires = new Date(Date.now() + ttlSeconds * 1000);
    await db.update(userSession).set({ expiresAt: newExpires }).where(eq(userSession.id, hashToken(session.id)));
    const refreshed = { ...session, expiresAt: newExpires };
    setSessionCookie(cookies, refreshed);
    return refreshed;
}

export async function invalidateSession(sessionToken: string) {
    await db.delete(userSession).where(eq(userSession.id, hashToken(sessionToken)));
}

export async function invalidateAllUserSessions(userId: string) {
    await db.delete(userSession).where(eq(userSession.userId, userId));
}