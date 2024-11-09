/*
    File

    Methods that directly corresponds to the endpoints of
    FileController in the backend.
*/

import { client } from "../client";
import { components } from '../openApiSchema';

export async function GetAll() {
    return (await client.GET('/api/StringFile/GetEntities')).data;
}

export async function GetByGuid(guid: string) {
    return (await client.GET('/api/StringFile/GetEntityByGuid/{guid}', {
        params: {
            path: {
                guid
            }
        }
    })).data;
}

export async function Post(body: components['schemas']['StringFileDto']) {
    return (await client.POST('/api/StringFile/PostEntity', {
        body
    })).data;
}

export async function Put(body: components['schemas']['StringFileDto']) {
    return (await client.PUT('/api/StringFile/PutEntity', {
        body
    })).data;
}

export async function Delete(guid: string) {
    await client.DELETE('/api/StringFile/DeleteEntity/{guid}', {
        params: {
            path: {
                guid
            }
        }
    });
}