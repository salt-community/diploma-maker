/*
    API

    A collection of methods that directly interact with
    backend API. This forms a layer of isolation between
    the backend API and the rest of the app.
*/

import * as BootcampEndpoints from './controllers/bootcampController';
import * as DiplomaEndpoints from './controllers/diplomaController';
import * as StringFileEndpoints from './controllers/stringFileController';
import * as StudentEndpoints from './controllers/studentController';
import * as TemplateEndpoints from './controllers/templateController';
import * as TrackController from './controllers/TrackController';

export const Endpoints = {
    Bootcamp: { ...BootcampEndpoints },
    Diploma: { ...DiplomaEndpoints },
    StringFile: { ...StringFileEndpoints },
    Student: { ...StudentEndpoints },
    Template: { ...TemplateEndpoints },
    Track: { ...TrackController }
};
