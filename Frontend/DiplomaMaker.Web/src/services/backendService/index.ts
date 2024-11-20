import * as BackendModels from "./models";
import { getDiplomaWithContentByGuid } from "./getDiplomaWithContentByGuid";
import { peekTemplates } from "./peekTemplates";

export namespace BackendService {
    export type ControllerName =
        'Diploma' |
        'Template';

    export type Dto =
        Diploma | Template;

    export type Template = BackendModels.Template;
    export type Diploma = BackendModels.Diploma;
}

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

export const BackendService = {
    Endpoints: {
        getDiplomaWithContentByGuid,
        peekTemplates,

        GetEntities: async <TEntity extends BackendService.Dto>(controller: BackendService.ControllerName) => {
            const endpoint = 'GetEntities';

            const response = await fetch(`${baseUrl}/${controller}/${endpoint}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            return await response.json() as TEntity[];
        },

        GetEntitiesByGuids: async <TEntity extends BackendService.Dto>(controller: BackendService.ControllerName, guids: string[]) => {
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

        GetEntity: async <TEntity extends BackendService.Dto>(controller: BackendService.ControllerName, guid: string) => {
            const endpoint = 'GetEntityByGuid';

            const response = await fetch(`${baseUrl}/${controller}/${endpoint}/${guid}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            return await response.json() as TEntity;
        },

        PostEntity: async <TEntity extends BackendService.Dto>(controller: BackendService.ControllerName, body: TEntity) => {
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

        PutEntity: async <TEntity extends BackendService.Dto>(controller: BackendService.ControllerName, body: TEntity) => {
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

        DeleteEntity: async (controller: BackendService.ControllerName, guid: string) => {
            const endpoint = 'DeleteEntity';

            const response = await fetch(`${baseUrl}/${controller}/${endpoint}/${guid}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
        }
    }
}