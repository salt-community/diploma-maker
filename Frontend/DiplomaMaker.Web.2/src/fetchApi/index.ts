import { Bootcamp, Diploma, StringFile, Student, Template, Track } from "./types";

export type ControllerName =
    'Bootcamp' |
    'Diploma' |
    'StringFile' |
    'Student' |
    'Template' |
    'Track';

//Todo: Set as environment variable
const baseUrl = 'http://localhost:5171/api';

export type Dto =
    Bootcamp | Diploma | StringFile | Student | Template | Track;

export const Endpoints = {
    GetEntities: async <TEntity extends Dto>(controller: ControllerName) => {
        const endpoint = 'GetEntities';

        const response = await fetch(`${baseUrl}/${controller}/${endpoint}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json() as TEntity[];
    },

    GetEntity: async <TEntity extends Dto>(controller: ControllerName, guid: string) => {
        const endpoint = 'GetEntity';

        const response = await fetch(`${baseUrl}/${controller}/${endpoint}/${guid}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json() as TEntity;
    },

    PostEntity: async <TEntity extends Dto>(controller: ControllerName, body: TEntity) => {
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

    PutEntity: async <TEntity extends Dto>(controller: ControllerName, body: TEntity) => {
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

    DeleteEntity: async (controller: ControllerName, guid: string) => {
        const endpoint = 'DeleteEntity';

        const response = await fetch(`${baseUrl}/${controller}/${endpoint}/${guid}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    }
}