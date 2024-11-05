import createClient from "openapi-fetch"
import type { paths } from "../openApiSchema";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function sendEmailToStudent(guid: string, title: string, description: string, file: string) {
    await client.POST('/api/Email/SendEmailToStudent/{guid}', {
        params: {
            path: { guid },
            query: {
                Title: title,
                Description: description
            }
        },
        body: {
            File: file
        }
    });
}
