import { MakeSnapshotActiveRequest, SnapshotResponse } from "../dtos/snapshots";
import { client } from "./client";


export async function getSnapshots() {
    const { data } = await client.GET('/api/Snapshots/GetSnapshots');

    return data as unknown as SnapshotResponse[];
}

export async function getSnapshotByVerificationCode(verificationCode: string) {
    const { data } = await client.GET('/api/Snapshots/GetSnapshot/{verificationCode}', {
        params: {
            path: {
                verificationCode
            }
        }
    });

    return data as unknown as SnapshotResponse[];
}

export async function makeSnapshotActive(request: MakeSnapshotActiveRequest) {
    const { data } = await client.PUT('/api/Snapshots/MakeSnapshotActive', {
        body: {
            ...request
        }
    });

    return data as unknown as SnapshotResponse[];
}