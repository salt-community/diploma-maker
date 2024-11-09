/*
    File

    Methods that directly corresponds to the endpoints of
    FileController in the backend.
*/

import { client } from "../client";
import { components } from '../openApiSchema';

export async function GetAll() {
    return (await client.GET('/api/Diploma/GetEntities')).data;
}

export async function GetByGuid(guid: string) {
    return (await client.GET('/api/Diploma/GetEntityByGuid/{guid}', {
        params: {
            path: {
                guid
            }
        }
    })).data;
}

export async function Post(body: components['schemas']['DiplomaDto']) {
    return (await client.POST('/api/Diploma/PostEntity', {
        body
    })).data;
}

export async function Put(body: components['schemas']['DiplomaDto']) {
    return (await client.PUT('/api/Diploma/PutEntity', {
        body
    })).data;
}

export async function Delete(guid: string) {
    await client.DELETE('/api/Diploma/DeleteEntity/{guid}', {
        params: {
            path: {
                guid
            }
        }
    });
}