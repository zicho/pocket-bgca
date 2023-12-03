import { ResponseSuccess } from "../strings/MiscMessages";

export type ApiResponse<T> = {
    result: T | null;
    error: boolean;
    messages: string[];
}

export function successfulResponse<T>(data: T): ApiResponse<T> {
    return {
        result: data,
        error: false,
        messages: [ResponseSuccess]
    }
}

export function failedResponse<T>(messages: string[]): ApiResponse<T> {
    return {
        result: null,
        error: true,
        messages
    }
}