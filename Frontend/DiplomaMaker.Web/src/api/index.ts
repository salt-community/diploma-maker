/*
    API

    A collection of methods that directly interact with
    backend API. This forms a layer of isolation between
    the backend API and the rest of the app.
*/

import { components } from './openApiSchema';
import { client } from './client';

export type ControllerName =
    'Bootcamp' |
    'Diploma' |
    'StringFile' |
    'Student' |
    'Template' |
    'Track';

export type Bootcamp = components['schemas']['Bootcamp'];
export type Diploma = components['schemas']['Diploma'];
export type StringFile = components['schemas']['StringFile'];
export type Student = components['schemas']['Student'];
export type Template = components['schemas']['Template'];
export type Track = components['schemas']['Track'];
export type Dto =
    Bootcamp | Diploma | StringFile | Student | Template | Track;

export const Endpoints = {
    GetAll: async (controller: ControllerName) => {
        switch (controller) {
            case 'Bootcamp':
                return (await client.GET(
                    '/api/Bootcamp/GetEntities')
                ).data as Bootcamp[];

            case 'Diploma':
                return (await client.GET(
                    '/api/Diploma/GetEntities')
                ).data as Diploma[];

            case 'StringFile':
                return (await client.GET(
                    '/api/StringFile/GetEntities')
                ).data as StringFile[];

            case 'Student':
                return (await client.GET(
                    '/api/Student/GetEntities')
                ).data as Student[];

            case 'Template':
                return (await client.GET(
                    '/api/Template/GetEntities')
                ).data as Template[];

            case 'Track':
                return (await client.GET(
                    '/api/Track/GetEntities')).data as Track[];
        }
    },

    GetByGuid: async (controller: ControllerName, guid: string) => {
        switch (controller) {
            case 'Bootcamp':
                return (await client.GET(
                    '/api/Bootcamp/GetEntityByGuid/{guid}',
                    { params: { path: { guid } } })
                ).data as Bootcamp;

            case 'Diploma':
                return (await client.GET(
                    '/api/Diploma/GetEntityByGuid/{guid}',
                    { params: { path: { guid } } })
                ).data as Diploma;

            case 'StringFile':
                return (await client.GET(
                    '/api/StringFile/GetEntityByGuid/{guid}',
                    { params: { path: { guid } } })
                ).data as StringFile;

            case 'Student':
                return (await client.GET(
                    '/api/Student/GetEntityByGuid/{guid}',
                    { params: { path: { guid } } })
                ).data as Student;

            case 'Template':
                return (await client.GET(
                    '/api/Template/GetEntityByGuid/{guid}',
                    { params: { path: { guid } } })
                ).data as Template;

            case 'Track':
                return (await client.GET(
                    '/api/Track/GetEntityByGuid/{guid}',
                    { params: { path: { guid } } })
                ).data as Track;
        }
    },

    Post: async <TEntity extends Dto>(controller: ControllerName, body: TEntity) => {
        console.log(body);
        switch (controller) {
            case 'Bootcamp':
                return (await client.POST(
                    '/api/Bootcamp/PostEntity', { body })
                ).data as Bootcamp;

            case 'Diploma':
                return (await client.POST(
                    '/api/Diploma/PostEntity', { body })
                ).data as Diploma;

            case 'StringFile':
                return (await client.POST(
                    '/api/StringFile/PostEntity', { body })
                ).data as StringFile;

            case 'Student':
                return (await client.POST(
                    '/api/Student/PostEntity', { body })
                ).data as Student;

            case 'Template':
                return (await client.POST(
                    '/api/Template/PostEntity', { body })
                ).data as Template;

            case 'Track':
                return (await client.POST(
                    '/api/Track/PostEntity', { body })
                ).data as Track;
        }

    },

    Put: async <TEntity extends Dto>(controller: ControllerName, body: TEntity) => {
        switch (controller) {
            case 'Bootcamp':
                return (await client.PUT('/api/Bootcamp/PutEntity', {
                    body
                })).data as Bootcamp;

            case 'Diploma':
                return (await client.PUT('/api/Diploma/PutEntity', {
                    body
                })).data as Diploma;

            case 'StringFile':
                return (await client.PUT('/api/StringFile/PutEntity', {
                    body
                })).data as StringFile;

            case 'Student':
                return (await client.PUT('/api/Student/PutEntity', {
                    body
                })).data as Student;

            case 'Template':
                return (await client.PUT('/api/Template/PutEntity', {
                    body
                })).data as Template;

            case 'Track':
                return (await client.PUT('/api/Track/PutEntity', {
                    body
                })).data as Track;
        }
    },

    Delete: async (controller: ControllerName, guid: string) => {
        switch (controller) {
            case 'Bootcamp':
                await client.DELETE('/api/Bootcamp/DeleteEntity/{guid}', { params: { path: { guid } } });
                break;

            case 'Diploma':
                await client.DELETE('/api/Diploma/DeleteEntity/{guid}', { params: { path: { guid } } });
                break;

            case 'StringFile':
                await client.DELETE('/api/StringFile/DeleteEntity/{guid}', { params: { path: { guid } } });
                break;

            case 'Student':
                await client.DELETE('/api/Student/DeleteEntity/{guid}', { params: { path: { guid } } });
                break;

            case 'Template':
                await client.DELETE('/api/Template/DeleteEntity/{guid}', { params: { path: { guid } } });
                break;

            case 'Track':
                await client.DELETE('/api/Track/DeleteEntity/{guid}', { params: { path: { guid } } });
                break;
        }

    }
};
