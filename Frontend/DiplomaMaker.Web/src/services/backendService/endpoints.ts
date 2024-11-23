import { BackendTypes } from '@/services'

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

export async function getHistoricDiplomaByGuid(guid: string) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/HistoricDiploma/GetHistoricDiploma/${guid}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as BackendTypes.HistoricDiploma;
}

export async function sendDiplomaEmail(request: BackendTypes.SendEmailRequest) {
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

export async function peekTemplates() {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/Template/PeekTemplates`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as BackendTypes.TemplatePeek[];
}

export async function getEntities<TEntity extends BackendTypes.Dto>(controller: BackendTypes.ControllerName) {
    const endpoint = 'GetEntities';

    const response = await fetch(`${baseUrl}/${controller}/${endpoint}`, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as TEntity[];
}

export async function getEntitiesByGuids<TEntity extends BackendTypes.Dto>(controller: BackendTypes.ControllerName, guids: string[]) {
    const endpoint = 'GetEntitiesByGuids';

    const response = await fetch(`${baseUrl}/${controller}/${endpoint}`, {
        method: 'GET',
        body: JSON.stringify(guids)
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as TEntity[];
}

export async function getEntity<TEntity extends BackendTypes.Dto>(controller: BackendTypes.ControllerName, guid: string) {
    const endpoint = 'GetEntityByGuid';

    const response = await fetch(`${baseUrl}/${controller}/${endpoint}/${guid}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as TEntity;
}

export async function postEntity<TEntity extends BackendTypes.Dto>(controller: BackendTypes.ControllerName, body: TEntity) {
    const endpoint = 'PostEntity';

    const response = await fetch(`${baseUrl}/${controller}/${endpoint}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as TEntity;
}

export async function putEntity<TEntity extends BackendTypes.Dto>(controller: BackendTypes.ControllerName, body: TEntity) {
    if (!body.guid) {
        throw new Error(`${controller} requires property 'guid' to be set on entity`);
    }

    const endpoint = 'PutEntity';

    const response = await fetch(`${baseUrl}/${controller}/${endpoint}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json() as TEntity;
}

export async function deleteEntity(controller: BackendTypes.ControllerName, guid: string) {
    const endpoint = 'DeleteEntity';

    const response = await fetch(`${baseUrl}/${controller}/${endpoint}/${guid}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
}

