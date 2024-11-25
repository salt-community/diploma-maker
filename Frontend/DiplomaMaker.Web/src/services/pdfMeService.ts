import * as PdfMeCommon from '@pdfme/common'
import * as PdfMeGenerator from '@pdfme/generator'
import * as PdfMeUi from '@pdfme/ui'
import * as PdfMeSchemas from '@pdfme/schemas'
import { TemplateTypes } from './templateService';
import { TemplateService, FontService } from '.';

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

    createPdfMeViewer: (
        domContainer: HTMLDivElement,
        template: PdfMeTypes.Template,
        substitions: TemplateTypes.Substitions) => {
        PdfMeService.checkTemplate(template);

        const inputs = TemplateService.substitutePlaceholdersWithContent(
            template,
            substitions
        ) as Record<string, any>[];

        new PdfMeService.Viewer({
            template,
            inputs,
            plugins: PdfMeService.plugins,
            domContainer,
            options: {
                font: FontService.getPdfMeFonts(),
            },
        });
    }
}


