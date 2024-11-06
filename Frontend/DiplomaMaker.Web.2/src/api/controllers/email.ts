import { client } from "./client";

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
