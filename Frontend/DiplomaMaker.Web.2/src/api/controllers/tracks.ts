import { TracksResponse } from "../dtos/tracks";
import { client } from "./client";

export async function getTracks() {
    const { data } = await client.GET('/api/Tracks/GetTracks');

    return data as unknown as TracksResponse[];
}