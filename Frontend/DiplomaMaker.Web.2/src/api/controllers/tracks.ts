import createClient from "openapi-fetch"
import type { paths } from "../openApiSchema";
import { TracksResponse } from "../dtos/tracks";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function getTracks() {
    const { data } = await client.GET('/api/Tracks/GetTracks');

    return data as unknown as TracksResponse[];
}