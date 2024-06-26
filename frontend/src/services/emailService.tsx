import { DiplomaRequest, DiplomaResponse, DiplomaUpdateRequestDto, DiplomasRequestDto, EmailSendRequest } from "../util/types";

const apiUrl = import.meta.env.VITE_API_URL;

export async function postEmail(guidId: string, emailRequest: EmailSendRequest): Promise<void> {

    const response = await fetch(`${apiUrl}/api/Email/${guidId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailRequest)
    });

    if(response.status == 409)
        throw new Error("");
    if(response.status == 404)
        throw new Error("")
    if(response.status == 400){
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create new diploma due to bad request!")
    }
    if (!response.ok) {
        throw new Error('dsa');
    }
}