import { describe, it, expect, beforeEach, vi } from 'vitest';
import { testScaffold } from '../testing/setupDb';
import { randomUUID } from 'node:crypto';

// ------------------------ MOCKS ----------------------
vi.mock('./db/db', () => ({
  get db() {
    return testScaffold.db;
  },
}));

// CRITICAL: This import should be after the db mock for it to take effect.
import {
  SESSION_COOKIE_NAME,
  generateSessionToken,
  hashToken,
  ensureAuthUser,
  createSessionForUserId,
  setSessionCookie,
  clearSessionCookie,
  readSession,
  refreshSessionIfNeeded,
  invalidateSession,
  invalidateAllUserSessions,
  type SessionRecord,
} from './session';
import * as schema from './db/schema';
import { eq } from 'drizzle-orm';

class CookiesMock {
  private map = new Map<string, string>();
  public setCalls: Array<{ name: string; value: string; opts: any }> = [];

  get(name: string) {
    return this.map.get(name);
  }
  set(name: string, value: string, opts: any) {
    this.map.set(name, value);
    this.setCalls.push({ name, value, opts });
  }
}

// ------------------------ TESTS ----------------------
describe('session utils', () => {
  beforeEach(async () => {
    // @ts-expect-error shaping test env for predictability
    import.meta.env = { ...(import.meta.env ?? {}), DEV: false };

    await testScaffold.db.delete(schema.userSession);
    await testScaffold.db.delete(schema.authUser);
  });

  describe("generateSessionToken", () => {
    it('produces URL-safe and unique token', () => {
      // Act
      const a = generateSessionToken();
      const b = generateSessionToken();

      // Assert
      expect(a).toMatch(/^[A-Za-z0-9\-_]+$/);
      expect(a).not.toBe(b);
      expect(a.length).toBeGreaterThanOrEqual(43);
    });
  });

  describe('hashToken', () => {
    it('returns correct hash from token', () => {
      // Arrange
      const input = 'abc';

      // Act
      const hash1 = hashToken(input);
      const hash2 = hashToken(input);
      const hashOther = hashToken('def');

      // Assert
      expect(hash1).toMatch(/^[a-f0-9]{64}$/);
      expect(hash2).toBe(hash1);
      expect(hashOther).not.toBe(hash1);
    });

    it('handles empty string input', () => {
      // Arrange
      const input = '';

      // Act
      const hash = hashToken(input);

      // Assert
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });
  
  
  describe('ensureAuthUser', () => {
    it('upserts by id and updates email', async () => {
      // Arrange
      const id = randomUUID();

      // Act
      await ensureAuthUser({ id, email: 'first@ex.com' });
      await ensureAuthUser({ id, email: 'updated@ex.com' });

      // Assert
      const rows = await testScaffold.db
        .select({ id: schema.authUser.id, email: schema.authUser.email })
        .from(schema.authUser)
        .where(eq(schema.authUser.id, id));

      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ id, email: 'updated@ex.com' });
    });

    it('calling twice with same values is idempotent (still one row)', async () => {
      // Arrange
      const id = randomUUID();

      // Act
      await ensureAuthUser({ id, email: 'x@ex.com' });
      await ensureAuthUser({ id, email: 'x@ex.com' });

      // Assert
      const rows = await testScaffold.db
        .select({ id: schema.authUser.id })
        .from(schema.authUser)
        .where(eq(schema.authUser.id, id));
      expect(rows).toHaveLength(1);
    });

    it('throws when id is not a valid UUID', async () => {
      // Arrange
      const invalidId = 'not-a-uuid';

      // Act + Assert
      await expect(
        ensureAuthUser({ id: invalidId, email: 'fail@example.com' })
      ).rejects.toThrow(/invalid input syntax for type uuid/);

      const rows = await testScaffold.db
        .select()
        .from(schema.authUser)
        .where(eq(schema.authUser.email, 'fail@example.com'));
      expect(rows).toHaveLength(0);
    });
  });
  
  describe('createSessionForUserId', () => {
    it('stores hashed id in DB and returns raw token with correct expiresAt', async () => {
      // Arrange
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);
      const userId = randomUUID();
      await ensureAuthUser({ id: userId, email: 'user42@example.com' });

      // Act
      const record = await createSessionForUserId(userId, 1000);

      // Assert
      const hashed = hashToken(record.id);
      const rows = await testScaffold.db
        .select()
        .from(schema.userSession)
        .where(eq(schema.userSession.id, hashed));

      expect(rows).toHaveLength(1);
      expect(rows[0].userId).toBe(userId);
      expect(Math.abs(record.expiresAt.getTime() - (now + 1000 * 1000))).toBeLessThan(5);
    });

    it('throws when user does not exist (foreign key violation)', async () => {
      // Arrange
      const nonExistingUserId = randomUUID();

      // Act + Assert
      await expect(createSessionForUserId(nonExistingUserId, 60))
        .rejects.toThrow(/foreign key|violates foreign key constraint/i);
    });
  });
  
  describe('setSessionCookie', () => {
    it('sets cookie value and flags (secure=true when DEV=false)', () => {
      // Arrange   
      const cookies = new CookiesMock();
      const session: SessionRecord = {
        id: 'tok',
        userId: 'u',
        expiresAt: new Date('2099-01-01T00:00:00Z'),
      };

      // Act
      setSessionCookie(cookies as any, session);

      // Assert
      const call = cookies.setCalls[0];
      expect(call.name).toBe(SESSION_COOKIE_NAME);
      expect(call.value).toBe('tok');
      expect(call.opts).toMatchObject({
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        expires: session.expiresAt,
      });
    });
  });

  describe('clearSessionCookie', () => {
    it('empties value and sets epoch expiry', () => {
      // Arrange
      const cookies = new CookiesMock();

      // Act
      clearSessionCookie(cookies as any);

      // Assert
      const call = cookies.setCalls[0];
      expect(call.name).toBe(SESSION_COOKIE_NAME);
      expect(call.value).toBe('');
      expect(call.opts.expires.getTime()).toBe(new Date(0).getTime());
    });
  });
  
  describe('readSession', () => {
    it('returns null when cookie is missing', async () => {
      // Arrange
      const cookies = new CookiesMock();

      // Act
      const result = await readSession(cookies as any);

      // Assert
      expect(result).toBeNull();
    });

    it('returns null when DB has no matching row', async () => {
      // Arrange
      const cookies = new CookiesMock();
      cookies.set(SESSION_COOKIE_NAME, 'raw-token', {});

      // Act
      const result = await readSession(cookies as any);

      // Assert
      expect(result).toBeNull();
    });

    it('returns null when session is expired', async () => {
      // Arrange
      const token = 't';
      const userId = randomUUID();
      const cookies = new CookiesMock();
      cookies.set(SESSION_COOKIE_NAME, token, {});
      await ensureAuthUser({ id: userId, email: 'x@ex.com' });
      await testScaffold.db.insert(schema.userSession).values({
        id: hashToken(token),
        userId: userId,
        expiresAt: new Date('2000-01-01T00:00:00Z'),
      });

      // Act
      const result = await readSession(cookies as any);

      // Assert
      expect(result).toBeNull();
    });

    it('returns session record when valid and not expired', async () => {
      // Arrange
      const token = 't';
      const userId = randomUUID();
      const cookies = new CookiesMock();
      cookies.set(SESSION_COOKIE_NAME, token, {});
      const future = new Date(Date.now() + 60_000);
      await ensureAuthUser({ id: userId, email: 'x@ex.com' });
      await testScaffold.db.insert(schema.userSession).values({
        id: hashToken(token),
        userId: userId,
        expiresAt: future,
      });

      // Act
      const result = await readSession(cookies as any);

      // Assert
      expect(result).toEqual({ id: token, userId: userId, expiresAt: future });
    });

    it('returns null if expiresAt is now (expired)', async () => {
      // Arrange
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);
      const userId = randomUUID();
      const token = 't-boundary-eq';
      const cookies = new CookiesMock();
      cookies.set(SESSION_COOKIE_NAME, token, {});
      await ensureAuthUser({ id: userId, email: 'x@ex.com' });
      await testScaffold.db.insert(schema.userSession).values({
        id: hashToken(token),
        userId: userId,
        expiresAt: new Date(now), // exactly now
      });

      // Act
      const res = await readSession(cookies as any);

      // Assert
      expect(res).toBeNull();
    });

    it('returns valid Session if expiresAt is > now by 100ms', async () => {
      // Arrange
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);
      const userId = randomUUID();
      const token = 't-boundary-gt';
      const future = new Date(now + 100);
      const cookies = new CookiesMock();
      cookies.set(SESSION_COOKIE_NAME, token, {});
      await ensureAuthUser({ id: userId, email: 'x@ex.com' });
      await testScaffold.db.insert(schema.userSession).values({
        id: hashToken(token),
        userId: userId,
        expiresAt: future,
      });

      // Act
      const res = await readSession(cookies as any);

      // Assert
      expect(res).toEqual({ id: token, userId: userId, expiresAt: future });
    });
  })
  
  describe('refreshSessionIfNeeded', () => {
    it('does no-op when time left is above threshold', async () => {
      // Arrange
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);
      const cookies = new CookiesMock();
      const userId = randomUUID();
      await ensureAuthUser({ id: userId, email: 'x@ex.com' });
      const session: SessionRecord = {
        id: 'tok',
        userId: userId,
        expiresAt: new Date(now + 2 * 86_400 * 1000), // +2 days
      };

      // Act
      const result = await refreshSessionIfNeeded(cookies as any, session, 999_999);

      // Assert
      expect(result).toBe(session);
      expect(cookies.setCalls.length).toBe(0);
    });

    it('extends expiry, updates DB and cookie when below threshold', async () => {
      // Arrange
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);
      const token = 'tok';
      const hashed = hashToken(token);
      const soon = new Date(now + 3600 * 1000);
      const userId = randomUUID();
      await ensureAuthUser({ id: userId, email: 'x@ex.com' });
      await testScaffold.db.insert(schema.userSession).values({
        id: hashed,
        userId: userId,
        expiresAt: soon,
      });
      const cookies = new CookiesMock();
      const session: SessionRecord = { id: token, userId: userId, expiresAt: soon };

      // Act
      const refreshed = await refreshSessionIfNeeded(cookies as any, session, 1000);

      // Assert
      expect(Math.abs(refreshed.expiresAt.getTime() - (now + 1000 * 1000))).toBeLessThan(5);
      const [row] = await testScaffold.db
        .select()
        .from(schema.userSession)
        .where(eq(schema.userSession.id, hashed));
      expect(row.expiresAt.getTime()).toBe(refreshed.expiresAt.getTime());
      expect(cookies.setCalls.length).toBe(1);
      expect(cookies.setCalls[0].name).toBe(SESSION_COOKIE_NAME);
    });

    it('triggers refresh when expiry is exactly at threadhold', async () => {
      // Arrange
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);
      const thresholdSeconds = 86_400;
      const token = 'tok-threshold';
      const atThreshold = new Date(now + thresholdSeconds * 1000);
      const userId = randomUUID();
      await ensureAuthUser({ id: userId, email: 'x@ex.com' });
      await testScaffold.db.insert(schema.userSession).values({
        id: hashToken(token),
        userId: userId,
        expiresAt: atThreshold,
      });
      const cookies = new CookiesMock();
      const session: SessionRecord = { id: token, userId: userId, expiresAt: atThreshold };

      // Act
      const refreshed = await refreshSessionIfNeeded(cookies as any, session, 1000);

      // Assert
      expect(refreshed.expiresAt.getTime()).toBe(now + 1000 * 1000);
      expect(cookies.setCalls.length).toBe(1);
    });

    it('updates DB & cookie when ttl is very small (<1s)', async () => {
      // Arrange
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);
      const token = 'tok-small-ttl';
      const near = new Date(now + 10 * 1000);
      const userId = randomUUID();
      await ensureAuthUser({ id: userId, email: 'x@ex.com' });
      await testScaffold.db.insert(schema.userSession).values({
        id: hashToken(token),
        userId: userId,
        expiresAt: near,
      });
      const cookies = new CookiesMock();
      const session: SessionRecord = { id: token, userId: userId, expiresAt: near };

      // Act
      const refreshed = await refreshSessionIfNeeded(cookies as any, session, 1);

      // Assert
      expect(refreshed.expiresAt.getTime()).toBe(now + 1000);
      const [row] = await testScaffold.db
        .select()
        .from(schema.userSession)
        .where(eq(schema.userSession.id, hashToken(token)));
      expect(row.expiresAt.getTime()).toBe(refreshed.expiresAt.getTime());
      expect(cookies.setCalls.length).toBe(1);
    });

  });
  
  describe('invalidateSession', () => {
    it('deletes a session by hashed token id', async () => {
      // Arrange
      const token = 'tok-123';
      const userId = randomUUID();
      await ensureAuthUser({ id: userId, email: 'x@ex.com' });
      await testScaffold.db.insert(schema.userSession).values({
        id: hashToken(token),
        userId: userId,
        expiresAt: new Date(Date.now() + 60_000),
      });

      // Act
      await invalidateSession(token);

      // Assert
      const after = await testScaffold.db
        .select()
        .from(schema.userSession)
        .where(eq(schema.userSession.id, hashToken(token)));
      expect(after).toHaveLength(0);
    });

    it('deleting non-existent token does not throw', async () => {
      // Arrange
      const missing = 'nope';

      // Act
      await expect(invalidateSession(missing)).resolves.toBeUndefined();

      // Assert
      const all = await testScaffold.db.select().from(schema.userSession);
      expect(all.length).toBe(0);
    });
  });

  describe('invalidateAllUserSessions', () => {
    it('deletes all sessions for a userId', async () => {
      // Arrange
      const userId1 = randomUUID();
      const userId2 = randomUUID();
      await ensureAuthUser({ id: userId1, email: 'x@ex.com' });
      await ensureAuthUser({ id: userId2, email: 'x2@ex.com' });
      await testScaffold.db.insert(schema.userSession).values([
        { id: hashToken('a'), userId: userId1, expiresAt: new Date(Date.now() + 60_000) },
        { id: hashToken('b'), userId: userId1, expiresAt: new Date(Date.now() + 60_000) },
        { id: hashToken('c'), userId: userId2, expiresAt: new Date(Date.now() + 60_000) },
      ]);

      // Act
      await invalidateAllUserSessions(userId1);

      // Assert
      const uX = await testScaffold.db
        .select()
        .from(schema.userSession)
        .where(eq(schema.userSession.userId, userId1));
      const others = await testScaffold.db
        .select()
        .from(schema.userSession)
        .where(eq(schema.userSession.userId, userId2));
      expect(uX).toHaveLength(0);
      expect(others).toHaveLength(1);
    });

    it('does no-op when deleting for user with no sessions', async () => {
      // Act
      await expect(invalidateAllUserSessions('u-missing')).resolves.toBeUndefined();

      // Assert
      const all = await testScaffold.db.select().from(schema.userSession);
      expect(all.length).toBe(0);
    });
  });
});
