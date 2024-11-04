import createClient from "openapi-fetch"
import type { paths } from "../open-api-schema";
import { BootcampRequestDto, BootcampRequestUpdateDto, BootcampResponseDto } from "../types";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function postBootCamp(request: BootcampRequestDto) {
    const { data } = await client.POST('/api/Bootcamps', {
        body: request
    });

    if (!data) {
        console.error("postBootCamp: no data");
    }

    return data as BootcampResponseDto;
}

export async function getBootCamps() {
    const { data } = await client.GET('/api/Bootcamps', {
    });

    if (!data) {
        console.error("getBootCamps: no data");
    }

    return data as unknown as BootcampResponseDto;
}

export async function getBootcampByGuidId(guidId: string) {
    const { data } = await client.GET('/api/Bootcamps/{guidId}', {
        params: {
            path: {
                guidId
            }
        }
    });

    if (!data) {
        console.error("getBootcampByGuidId: no data");
    }

    return data as BootcampResponseDto;
}

export async function deleteBootcamp(guidId: string) {
    await client.DELETE('/api/Bootcamps/{guidId}', {
        params: {
            path: {
                guidId
            }
        }
    });
}

export async function putBootcamp(guidId: string, request: BootcampRequestDto) {
    const { data } = await client.PUT('/api/Bootcamps/{guidId}', {
        params: {
            path: {
                guidId
            }
        },
        body: request
    });

    if (!data) {
        console.error("putBootcamp: no data");
    }

    return data as BootcampResponseDto;
}

export async function updatePreviewData(guidId: string, request: BootcampRequestUpdateDto) {
    const { data } = await client.PUT('/api/Bootcamps/dynamicfields/{guidId}', {
        params: {
            path: {
                guidId
            }
        },
        body: request
    });

    if (!data) {
        console.error("putBootcamp: no data");
    }

    return data as BootcampResponseDto;
}