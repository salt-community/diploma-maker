import createClient from "openapi-fetch"
import type { paths } from "../open-api-schema";
import { TracksResponseDto } from "../types";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function getTracks() {
    const { data } = await client.GET('/api/Tracks');

    return data as TracksResponseDto[];
}