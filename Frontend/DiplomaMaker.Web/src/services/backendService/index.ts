import * as Crud from './controllers/crud'
import * as Email from './controllers/email'
import * as HistoricDiploma from './controllers/historicDiploma'
import * as Template from './controllers/template'
import * as ValidateDiploma from './controllers/validateDiploma'

export const BackendService = {
    ...Crud,
    ...Email,
    ...HistoricDiploma,
    ...Template,
    ...ValidateDiploma
};

export type { BackendTypes } from './types'

