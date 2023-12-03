import type { LayoutServerLoad } from "./$types";
import { loadFlash, redirect } from "sveltekit-flash-message/server";

export const load: LayoutServerLoad = loadFlash(async (event) => {
	const { locals, cookies } = event;
	const user = locals.user;

	try {
		if (locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
		}
	} catch (_) {
		if (cookies.get("pb_auth")) {
			cookies.delete("pb_auth");
			throw redirect(303, "/login");
		}
	}

	return {
		user
	};
});