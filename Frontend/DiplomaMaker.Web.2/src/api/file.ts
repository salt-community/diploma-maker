import { client } from "./client";

export async function UploadFile(fileType: string, content: string) {
    const { data } = await client.POST('/api/File/UploadFile', {
        body: { fileType, content }
    });

    return data as string;
}

export async function GetFile(guid: string) {
    const { data } = await client.GET('/api/File/GetFile/{guid}', {
        params: { path: { guid } }
    });

    return data;
}