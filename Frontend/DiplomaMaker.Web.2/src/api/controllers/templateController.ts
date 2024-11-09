/*
    File

    Methods that directly corresponds to the endpoints of
    FileController in the backend.
*/

import { client } from "../client";
import { components } from '../openApiSchema';

export async function GetAll() {
    return (await client.GET('/api/Template/GetEntities')).data;
}

export async function GetByGuid(guid: string) {
    return (await client.GET('/api/Template/GetEntityByGuid/{guid}', {
        params: {
            path: {
                guid
            }
        }
    })).data;
}

export async function Post(body: components['schemas']['TemplateDto']) {
    return (await client.POST('/api/Template/PostEntity', {
        body
    })).data;
}

export async function Put(body: components['schemas']['TemplateDto']) {
    return (await client.PUT('/api/Template/PutEntity', {
        body
    })).data;
}

export async function Delete(guid: string) {
    await client.DELETE('/api/Template/DeleteEntity/{guid}', {
        params: {
            path: {
                guid
            }
        }
    });
}