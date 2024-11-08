/*
    Middleware

    Defines OpenApi TypeScript middleware for use with the client.
*/


import { Middleware } from "openapi-fetch";

export const throwOnError: Middleware = {
    async onRequest({ request }) {
        return request;
    },

    async onResponse({ response }) {
        if (!response.ok)
            throw new Error(response.statusText);

        return response;
    },
};