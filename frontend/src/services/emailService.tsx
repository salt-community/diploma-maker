import { EmailSendRequest } from "../util/types";

export async function postEmail(apiUrl: string, emailRequest: EmailSendRequest): Promise<void> {
    const formData = new FormData();
    formData.append('file', emailRequest.file);
    formData.append('email', emailRequest.email);
    formData.append('password', emailRequest.senderCode);
    formData.append('title', emailRequest.title);
    formData.append('description', emailRequest.description);

    console.log(formData);

    const response = await fetch(`${apiUrl}/api/Email/email-student/${emailRequest.guidId}`, {
        method: 'POST',
        body: formData,
    });

    // const response = await fetch(`${apiUrl}/api/Email/email-student/${emailRequest.guidId}?Email=${encodeURIComponent(emailRequest.email)}&Password=${encodeURIComponent(emailRequest.senderCode)}`, {
    //     method: 'POST',
    //     body: formData,
    // });

    if (response.status === 409)
        throw new Error("Conflict");
    if (response.status === 404)
        throw new Error("Not Found");
    if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    if (!response.ok) {
        throw new Error('Error sending email');
    }
}