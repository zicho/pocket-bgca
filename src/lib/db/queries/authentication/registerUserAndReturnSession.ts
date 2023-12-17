import { CouldNotCreateUser } from "$lib/data/strings/ErrorMessages";
import { successfulResponse, type ApiResponse, failedResponse } from "$lib/data/types/ApiResponse";
import { pb } from "$lib/db/pb";
import { ClientResponseError } from "pocketbase";
import parseClientResponseErrors from "$lib/utils/parseClientResponseErrors";

export default async function createUserAndReturnId({ username, password }: { username: string, password: string }): Promise<ApiResponse<string>> {
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
