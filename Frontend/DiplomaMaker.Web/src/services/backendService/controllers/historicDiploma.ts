import { BackendTypes } from '@/services'

export async function getHistoricDiplomaByGuid(guid: string) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/HistoricDiploma/GetHistoricDiploma/${guid}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as BackendTypes.HistoricDiploma;
}