import createClient from "openapi-fetch"
import type { paths } from "../openApiSchema";
import { DiplomatePutRequest } from "../dtos/diploma";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function getTemplateBackground(filename: string) {
    const { data, error } = await client.GET("/api/Blob/GetTemplateBackground/{filename}", {
        params: {
            path: {
                filename
            }
        }
    });

    if (error)
        throw new Error("BadRequest");

    return data;
}

export async function getTemplateBackgrounds() {
    const { data } = await client.GET("/api/Blob/GetTemplateBackgrounds");

    return data;
}

export async function getDiploma(filename: string) {
    const { data, error } = await client.GET("/api/Blob/GetDiploma/{filename}", {
        params: {
            path: {
                filename
            }
        }
    });

    if (error)
        throw new Error("BadRequest");

    return data;
}

export async function getDiplomaThumbnail(filename: string) {
    const { data, error } = await client.GET("/api/Blob/GetDiplomaThumbnail/{filename}", {
        params: {
            path: {
                filename
            }
        }
    });

    if (error)
        throw new Error("BadRequest");

    return data;
}

export async function putDiploma(request: DiplomatePutRequest) {
    const { data } = await client.PUT("/api/Blob/PutDiploma", {
        body: request
    });

    return data;
}

export async function getFont(filename: string, fontType: string) {
    const { data } = await client.GET("/api/Blob/GetDiplomaThumbnail/{filename}", {
        params: {
            path: {
                filename,
                fontType
            }
        }
    });

    return data;
}

