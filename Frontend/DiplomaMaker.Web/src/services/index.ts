/*
    Services

    A collection of methods that simplifies other code.
*/

export * as FileService from './fileService'
export * as TemplateService from './templateService'

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

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PdfMeTypes {
    export type Template = PdfMeCommon.Template;
    export class Designer extends PdfMeUi.Designer { };
    export type Font = PdfMeCommon.Font;
}
