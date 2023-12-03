// hooks.server.ts
import { redirect, type Handle, error } from "@sveltejs/kit";
import type { AuthModel } from 'pocketbase';
import { pb } from "$lib/db/pb";

export const handle: Handle = async ({ event, resolve }) => {

	event.locals.pb = pb;
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.locals.user = structuredClone<AuthModel>(event.locals.pb.authStore.model);
		}
	} catch (_) {
		event.locals.pb.authStore.clear();
		event.locals.user = undefined;
		
		const response = await resolve(event);

		const modifiedResponse = new Response(null, {
			status: 401,
			headers: {
			  ...response.headers,
			  'Set-Cookie': 'pb_auth=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
			},
		  });
	  
		  return modifiedResponse;
	}

	if (event.route?.id?.includes("(protected)") && !event.locals.user) {
		throw redirect(303, "/login")
	}

	if (event.route?.id?.includes("(non_authed)") && event.locals.user) {
		throw redirect(303, "/")
	}

	const response = await resolve(event);

	response.headers.set("set-cookie", event.locals.pb.authStore.exportToCookie({ secure: false })); // TODO: fix when https is implemented.
	return response;
};