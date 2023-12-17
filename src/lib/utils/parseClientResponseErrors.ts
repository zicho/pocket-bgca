import { IncorrectUsernameOrPassword, UnknownError, UsernameAlreadyTaken } from "$lib/data/strings/ErrorMessages";
import type { ClientResponseError } from "pocketbase";

export default function parseClientResponseErrors(e: ClientResponseError): string[] {
    try {
        const errors = Object.values(e.response.data as { code: string; message: string; }[]);

        if(e.response.message) {
            errors.push({
                code: e.response.code ?? 500,
                message: e.response.message
            });
        }

        const messages: string[] = [];

        if ((errors.length === 0)) {
            return [UnknownError];
        }

        const knownErrorCodes: Record<string, string> = {
            "validation_invalid_username": UsernameAlreadyTaken,
            "400": IncorrectUsernameOrPassword
        };


        errors.forEach((err) => {
            if (err.code && knownErrorCodes.hasOwnProperty(err.code)) {
                messages.push(knownErrorCodes[err.code]);
            } else {
                messages.push(err.message);
            }
        });

        return messages;
    } catch {
        return [UnknownError];
    }
}
