import { loginUserSchema } from "$lib/data/validation_schemas/loginUserSchema";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { message, setError, superValidate } from "sveltekit-superforms/server";
import loginUserAndReturnId from "$lib/db/queries/authentication/loginUserAndReturnSession";
import formatMessagesToHtmlWithLineBreaks from "$lib/utils/formatMessagesToHtmlWithLineBreaks";
import { redirect } from "sveltekit-flash-message/server";

export const load = (async (event) => {
    const form = await superValidate(event, loginUserSchema);
    return {
        form
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const { request } = event;

        const form = await superValidate(request, loginUserSchema);

        if (!form.valid) {
            return fail(400, { form });
        }

        const response = await loginUserAndReturnId(form.data);

        if (response.error) {
            setError(form, 'username', 'Invalid credentials');
            setError(form, 'password', 'Invalid credentials');
            return message(form, formatMessagesToHtmlWithLineBreaks(response.messages));
        } 
        
        throw redirect(
            302,
            "/",
            {
                type: "success",
                message: `Welcome!`
            },
            event
        );
    }
};
