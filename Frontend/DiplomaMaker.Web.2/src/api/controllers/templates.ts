import createClient from "openapi-fetch"
import type { paths } from "../open-api-schema";
import { TemplatePostRequestDto, TemplateRequestDto, TemplateResponseDto } from '../types';

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function getTemplates() {
    const { data } = await client.GET('/api/Templates');

    return data as TemplateResponseDto[];
}

export async function getTemplateById(id: number) {
    const { data } = await client.PUT('/api/Templates/{id}', {
        params: {
            path: {
                id,
            }
        },
    });

    return data as TemplateResponseDto;
}

export async function postTemplate(request: TemplatePostRequestDto) {
    const { data } = await client.POST('/api/Templates', {
        body: request
    });

    return data as TemplateResponseDto;
}

export async function deleteTemple(id: number) {
    await client.DELETE('/api/Templates/{id}', {
        params: {
            path: {
                id
            }
        }
    });
}

export async function putTemplate(id: number, request: TemplateRequestDto) {
    const { data } = await client.PUT('/api/Templates/{id}', {
        params: {
            path: {
                id
            }
        },
        body: request
    });

    return data as TemplateResponseDto;
}