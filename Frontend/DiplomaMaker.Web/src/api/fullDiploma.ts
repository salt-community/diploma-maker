import { FullDiploma } from "./models";

export async function getFullDiplomaByGuid(guid: string) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/FullDiploma/${guid}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as FullDiploma;
}