import { DiplomaWithContent } from "./models";

export async function getDiplomaWithContentByGuid(guid: string) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/DiplomaWithContent/${guid}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as DiplomaWithContent;
}