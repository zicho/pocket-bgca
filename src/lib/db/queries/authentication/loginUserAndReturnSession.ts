import { CouldNotCreateUser, UsernameAlreadyTaken } from "$lib/data/strings/ErrorMessages";
import { successfulResponse, type ApiResponse, failedResponse } from "$lib/data/types/ApiResponse";
import { pb } from "$lib/db/pb";
import { LuciaError } from "lucia";

export default async function loginUserAndReturnSession({ username, password }: { username: string, password: string }): Promise<ApiResponse<string>> {
    try {
        const user = await pb.collection("users").authWithPassword(username, password);

        return successfulResponse(user.record.id);
    } catch (e) {
        // todo: log

        console.log(e);

        if (e instanceof LuciaError && e.message === "AUTH_DUPLICATE_KEY_ID") {
            return failedResponse([UsernameAlreadyTaken]);
        }

        return failedResponse([CouldNotCreateUser]);
    }
}
