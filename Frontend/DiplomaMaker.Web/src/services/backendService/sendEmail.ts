import { SendEmailRequest } from './models';
export async function sendDiplomaEmail(request: SendEmailRequest) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/Email/SendDiplomaEmail`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
}