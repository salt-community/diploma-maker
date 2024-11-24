import { BackendTypes } from '@/services'

export async function peekTemplates() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/Template/PeekTemplates`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as BackendTypes.TemplatePeek[];
}