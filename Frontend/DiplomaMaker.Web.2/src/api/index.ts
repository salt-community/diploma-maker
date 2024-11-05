import * as BlobEndpoints from './controllers/blob';
import * as BlobTypes from './dtos/blob';
import * as BootcampsEndpoints from './controllers/bootcamps';
import * as BootcampTypes from './dtos/bootcamps';
import * as EmailEndpoints from './controllers/email'
import * as EmailTypes from './dtos/email';
import * as HistorySnapshotsEndpoints from './controllers/history-snapshots'
import * as HistorySnapshotsTypes from './dtos/history-snapshots';
import * as StudentsEndpoints from './controllers/students'
import * as StudentsTypes from './dtos/students';
import * as TemplatesEndpoints from './controllers/templates'
import * as TemplateTypes from './dtos/templates';
import * as TracksEndpoints from './controllers/tracks'
import * as TracksTypes from './dtos/tracks';
import * as UserFontsEndpoints from './controllers/user-fonts'
import * as UserFontsTypes from './dtos/user-fonts';

export const Endpoints = {
    Blob: { ...BlobEndpoints },
    Bootcamps: { ...BootcampsEndpoints },
    Email: { ...EmailEndpoints },
    HistorySnapshots: { ...HistorySnapshotsEndpoints },
    Students: { ...StudentsEndpoints },
    Templates: { ...TemplatesEndpoints },
    Tracks: { ...TracksEndpoints },
    UserFonts: { ...UserFontsEndpoints }
};

export const Dtos = {
    Blob: { ...BlobTypes },
    Bootcamp: { ...BootcampTypes },
    Email: { ...EmailTypes },
    HistorySnapshots: { ...HistorySnapshotsTypes },
    Students: { ...StudentsTypes },
    Templates: { ...TemplateTypes },
    Tracks: { ...TracksTypes },
    UserFonts: { ...UserFontsTypes }
}