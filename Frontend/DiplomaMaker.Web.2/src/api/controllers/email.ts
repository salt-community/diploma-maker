import createClient from "openapi-fetch"
import type { paths } from "../open-api-schema";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

//TODO: Figure out how to send multipart form data
export async function sendEmailToStudent(guidID: string, googleToken: string) {
    await client.POST('/api/Email/email-student/{guidID}', {
        params: {
            path: {
                guidID
            },
            query: {
                googleToken
            }
        },
    });
}