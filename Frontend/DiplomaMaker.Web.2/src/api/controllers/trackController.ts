/*
    File

    Methods that directly corresponds to the endpoints of
    FileController in the backend.
*/

import { client } from "../client";
import { components } from '../openApiSchema';

export async function GetAll() {
    return (await client.GET('/api/Track/GetEntities')).data;
}

export async function GetByGuid(guid: string) {
    return (await client.GET('/api/Track/GetEntityByGuid/{guid}', {
        params: {
            path: {
                guid
            }
        }
    })).data;
}

export async function Post(body: components['schemas']['TrackDto']) {
    return (await client.POST('/api/Track/PostEntity', {
        body
    })).data;
}

export async function Put(body: components['schemas']['TrackDto']) {
    return (await client.PUT('/api/Track/PutEntity', {
        body
    })).data;
}

export async function Delete(guid: string) {
    await client.DELETE('/api/Track/DeleteEntity/{guid}', {
        params: {
            path: {
                guid
            }
        }
    });
}