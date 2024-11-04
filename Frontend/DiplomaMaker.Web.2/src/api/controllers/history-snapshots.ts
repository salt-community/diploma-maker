import createClient from "openapi-fetch"
import type { paths } from "../open-api-schema";
import { DiplomaSnapshotResponseDto, MakeActiveSnapshotRequestDto } from "../types";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function getHistory() {
    const { data } = await client.GET('/api/HistorySnapshots');

    return data as unknown as DiplomaSnapshotResponseDto;
}

export async function getHistoryByVerificationCode(verificationCode: string) {
    const { data } = await client.GET('/api/HistorySnapshots/{verificationCode}', {
        params: {
            path: {
                verificationCode
            }
        }
    });

    return data as unknown as DiplomaSnapshotResponseDto;
}

export async function makeActiveHistorySnapshot(request: MakeActiveSnapshotRequestDto) {
    const { data } = await client.PUT('/api/make-active-historysnapshot', {
        body: {
            ...request
        }
    });

    return data as unknown as DiplomaSnapshotResponseDto;
}