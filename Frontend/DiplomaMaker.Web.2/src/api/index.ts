/*
    API

    A collection of methods that directly interact with
    backend API. This forms a layer of isolation between
    the backend API and the rest of the app.
*/

import * as FileEndpoints from './file';

export const Endpoints = {
    File: { ...FileEndpoints }
};
