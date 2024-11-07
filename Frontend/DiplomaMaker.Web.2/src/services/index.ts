export * as FileService from './fileService'
export * as TemplateService from './templatesService'

import * as PdfMeCommon from '@pdfme/common'
import * as PdfMeGenerator from '@pdfme/generator'
import * as PdfMeUi from '@pdfme/ui'
import * as PdfMeSchemas from '@pdfme/schemas'

export const PdfMe = {
    ...PdfMeCommon,
    ...PdfMeGenerator,
    ...PdfMeUi,
    ...PdfMeSchemas
}

export namespace PdfMeTypes {
    export type Template = PdfMeCommon.Template;
    export class Designer extends PdfMeUi.Designer { };
}
