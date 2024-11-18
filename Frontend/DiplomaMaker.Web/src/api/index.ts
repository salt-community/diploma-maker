import * as BackendModels from "./models";
import { getFullDiplomaByGuid } from "./fullDiploma";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Backend {
    export type ControllerName =
        'Bootcamp' |
        'Diploma' |
        'StringFile' |
        'Student' |
        'Template' |
        'Track';

    export type Track = BackendModels.Track;
    export type Student = BackendModels.Student;
    export type StringFile = BackendModels.StringFile;
    export type Template = BackendModels.Template;
    export type Bootcamp = BackendModels.Bootcamp;
    export type Diploma = BackendModels.Diploma;

    export type Dto =
        Bootcamp | Diploma | StringFile | Student | Template | Track;
}

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;


export const Endpoints = {
    getFullDiplomaByGuid,

    GetEntities: async <TEntity extends Backend.Dto>(controller: Backend.ControllerName) => {
        const endpoint = 'GetEntities';

        const response = await fetch(`${baseUrl}/${controller}/${endpoint}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json() as TEntity[];
    },

    GetEntitiesByGuids: async <TEntity extends Backend.Dto>(controller: Backend.ControllerName, guids: string[]) => {
        const endpoint = 'GetEntitiesByGuids';

        const response = await fetch(`${baseUrl}/${controller}/${endpoint}`, {
            method: 'GET',
            body: JSON.stringify(guids)
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json() as TEntity[];
    },

    GetEntity: async <TEntity extends Backend.Dto>(controller: Backend.ControllerName, guid: string) => {
        const endpoint = 'GetEntityByGuid';

        const response = await fetch(`${baseUrl}/${controller}/${endpoint}/${guid}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json() as TEntity;
    },

    PostEntity: async <TEntity extends Backend.Dto>(controller: Backend.ControllerName, body: TEntity) => {
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
    },

    PutEntity: async <TEntity extends Backend.Dto>(controller: Backend.ControllerName, body: TEntity) => {
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
    },

    DeleteEntity: async (controller: Backend.ControllerName, guid: string) => {
        const endpoint = 'DeleteEntity';

        const response = await fetch(`${baseUrl}/${controller}/${endpoint}/${guid}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    }
}