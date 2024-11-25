import { BackendTypes } from '@/services'

export async function sendDiplomaEmail(request: BackendTypes.SendEmailRequest, jwt: string) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/Email/SendDiplomaEmail`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
}