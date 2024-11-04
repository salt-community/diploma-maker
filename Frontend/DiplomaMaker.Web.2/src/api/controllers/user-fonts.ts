import createClient from "openapi-fetch"
import type { paths } from "../open-api-schema";
import { UserFontRequestDto, UserFontResponseDto } from "../types";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function getUserFonts() {
    const { data } = await client.GET('/api/UserFonts');

    return data as UserFontResponseDto[];
}

export async function postUserFonts(request: UserFontRequestDto) {
    const { data } = await client.POST('/api/UserFonts', {
        body: {
            UserFontRequests: request
        }
    });

    return data as UserFontResponseDto[];
}