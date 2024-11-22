import * as PdfMeCommon from '@pdfme/common'
import * as PdfMeGenerator from '@pdfme/generator'
import * as PdfMeUi from '@pdfme/ui'
import * as PdfMeSchemas from '@pdfme/schemas'

export namespace PdfMeTypes {
    export type Template = PdfMeCommon.Template;
    export class Designer extends PdfMeUi.Designer { };
    export class Viewer extends PdfMeUi.Viewer { };
    export type Font = PdfMeCommon.Font;
}

export const PdfMeService = {
    plugins: {
        Text: PdfMeSchemas.text,
        QR: PdfMeSchemas.barcodes.qrcode,
        Image: PdfMeSchemas.image,
    },

    ...PdfMeCommon,
    ...PdfMeGenerator,
    ...PdfMeUi,
}
