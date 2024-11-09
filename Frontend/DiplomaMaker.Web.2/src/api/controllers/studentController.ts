/*
    File

    Methods that directly corresponds to the endpoints of
    FileController in the backend.
*/

import { client } from "../client";
import { components } from '../openApiSchema';

export async function GetAll() {
    return (await client.GET('/api/Student/GetEntities')).data;
}

export async function GetByGuid(guid: string) {
    return (await client.GET('/api/Student/GetEntityByGuid/{guid}', {
        params: {
            path: {
                guid
            }
        }
    })).data;
}

export async function Post(body: components['schemas']['StudentDto']) {
    return (await client.POST('/api/Student/PostEntity', {
        body
    })).data;
}

export async function Put(body: components['schemas']['StudentDto']) {
    return (await client.PUT('/api/Student/PutEntity', {
        body
    })).data;
}

export async function Delete(guid: string) {
    await client.DELETE('/api/Student/DeleteEntity/{guid}', {
        params: {
            path: {
                guid
            }
        }
    });
}