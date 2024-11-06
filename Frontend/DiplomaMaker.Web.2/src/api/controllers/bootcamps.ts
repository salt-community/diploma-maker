import createClient from "openapi-fetch"
import type { paths, components } from "../openApiSchema";
import { BootcampRequest, BootcampRequestUpdate, BootcampResponse } from "../dtos/bootcamps";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function postBootcamp(request: BootcampRequest) {
    const { data } = await client.POST("/api/Bootcamps/PostBootcamp", {
        body: request as unknown as components["schemas"]["BootcampRequestDto"]
    });

    return data as unknown as BootcampResponse;
}

export async function getBootcamps() {
    const { data } = await client.GET("/api/Bootcamps/GetBootcamps");

    return data as unknown as BootcampResponse[];
}

export async function getBootcamp(guid: string) {
    const { data } = await client.GET("/api/Bootcamps/GetBootcamp/{guid}", {
        params: {
            path: { guid }
        }
    });

    return data as unknown as BootcampResponse;
}

export async function deleteBootcamp(guid: string) {
    await client.DELETE("/api/Bootcamps/DeleteBootcamp/{guid}", {
        params: {
            path: { guid }
        }
    });
}

export async function putBootcamp(guid: string, request: BootcampRequestUpdate) {
    const { data, error } = await client.PUT("/api/Bootcamps/PutBootcamp/{guid}", {
        params: {
            path: { guid }
        },
        body: request as unknown as components['schemas']['BootcampRequestUpdateDto'] 
    });

    if (error) throw error;

    return data as unknown as BootcampResponse;
}