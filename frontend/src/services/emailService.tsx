import { EmailSendRequest } from "../util/types";

export async function postEmail(apiUrl: string, emailRequest: EmailSendRequest): Promise<void> {
    const formData = new FormData();
    formData.append('file', emailRequest.file);

    const response = await fetch(`${apiUrl}/api/Email/email-student/${emailRequest.guidId}`, {
        method: 'POST',
        body: formData
    });

    if(response.status == 409)
        throw new Error("");
    if(response.status == 404)
        throw new Error("")
    if(response.status == 400){
        const errorData = await response.json();
        throw new Error(errorData.message)
    }
    if (!response.ok) {
        throw new Error('dsa');
    }
}