/*
    File

    Methods that directly corresponds to the endpoints of
    FileController in the backend.
*/

import { client } from "../client";
import { components } from '../openApiSchema';

export async function GetAll() {
    return (await client.GET('/api/Bootcamp/GetEntities')).data;
}

export async function GetByGuid(guid: string) {
    return (await client.GET('/api/Bootcamp/GetEntityByGuid/{guid}', {
        params: {
            path: {
                guid
            }
        }
    })).data;
}

export async function Post(body: components['schemas']['BootcampDto']) {
    return (await client.POST('/api/Bootcamp/PostEntity', {
        body
    })).data;
}

export async function Put(body: components['schemas']['BootcampDto']) {
    return (await client.PUT('/api/Bootcamp/PutEntity', {
        body
    })).data;
}

export async function Delete(guid: string) {
    await client.DELETE('/api/Bootcamp/DeleteEntity/{guid}', {
        params: {
            path: {
                guid
            }
        }
    });
}