import type { Handle } from '@sveltejs/kit';
import { readSession, refreshSessionIfNeeded } from '$lib/server/session';

export const handle: Handle = async({ event, resolve }) => {
	const session = await readSession(event.cookies);

	if (session) {
		await refreshSessionIfNeeded(event.cookies, session);
		event.locals.session = session;
		event.locals.user = { id: session.userId };
	} else {
		event.locals.session = null;
		event.locals.user = null;
	}

	if (!event.url.pathname.startsWith('/auth') && !event.locals.session) {
		return Response.redirect(new URL('/auth/login', event.url), 302);
	}

	return resolve(event);
}