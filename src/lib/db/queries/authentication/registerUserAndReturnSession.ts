import { CouldNotCreateUser, UnknownError, UsernameAlreadyTaken } from "$lib/data/strings/ErrorMessages";
import { successfulResponse, type ApiResponse, failedResponse } from "$lib/data/types/ApiResponse";
import { pb } from "$lib/db/pb";
import { LuciaError } from "lucia";
import { ClientResponseError } from "pocketbase";

function parseClientResponseErrors(e: ClientResponseError): string[] {
    try {
        const errors = Object.values(e.response.data as { code: string, message: string }[]);
        const messages: string[] = [];

        if (!errors) {
            return [UnknownError];
        }

        const knownErrorCodes: Record<string, string> = {
            "validation_invalid_username": UsernameAlreadyTaken,
        };
        

        errors.forEach((err) => {
            if (err.code && knownErrorCodes.hasOwnProperty(err.code)) {
                messages.push(knownErrorCodes[err.code]);
                messages.push(knownErrorCodes[err.code]);
                messages.push(knownErrorCodes[err.code]);
                messages.push(knownErrorCodes[err.code]);
            } else {
                messages.push(err.message);
            }
        })

        return messages;
    } catch {
        return [UnknownError];
    }
}

export default async function registerUserAndReturnSession({ username, password }: { username: string, password: string }): Promise<ApiResponse<string>> {
    try {
        const user = await pb.collection("users").create({
            username,
            password,
            passwordConfirm: password,
        });

        await pb.collection("users").authWithPassword(username, password);

        return successfulResponse(user.id);
    } catch (e) {
        // todo: log
        console.log(e);

        if (e instanceof ClientResponseError) {
            return failedResponse(parseClientResponseErrors(e));
        }

        return failedResponse([CouldNotCreateUser]);
    }
}
