import { CouldNotCreateUser } from "$lib/data/strings/ErrorMessages";
import { successfulResponse, type ApiResponse, failedResponse } from "$lib/data/types/ApiResponse";
import { pb } from "$lib/db/pb";
import parseClientResponseErrors from "$lib/utils/parseClientResponseErrors";
import { ClientResponseError } from "pocketbase";

export default async function loginUserAndReturnId({ username, password }: { username: string, password: string }): Promise<ApiResponse<string>> {
    try {
        const user = await pb.collection("users").authWithPassword(username, password);

        return successfulResponse(user.record.id);
    } catch (e) {
        // todo: log
        console.log(e);

        if (e instanceof ClientResponseError) {
            return failedResponse(parseClientResponseErrors(e));
        }

        return failedResponse([CouldNotCreateUser]);
    }
}
