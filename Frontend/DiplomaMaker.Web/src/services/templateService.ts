/*
    TemplateService
    
    A collection of methods that manipulates PdfMe templates
    and pdf generation.
*/

import { FileService, PdfMe, PdfMeTypes } from ".";
import { Types } from "../types";

/*
    Accepts a PdfMe Template with placeholders and 
    constructs an input object to be used with PdfMe.generate()
    when generating pdfs.
*/
export function substitutePlaceholdersWithContent(
    template: PdfMeTypes.Template,
    substitutions: Types.TemplateTextSubstitions) {

    const inputs: Record<string, unknown> = {};

    Object.entries(template.schemas[0]).forEach(entry => {
        const fieldName = entry[1]['name'];
        const typeName = entry[1]['type'];
        let content = entry[1]['content'];

        switch (typeName) {
            case 'qrcode':
            case 'text':
                Object.entries(substitutions.text).forEach(([placeholder, substitution]) => {
                    content = content!.replace(placeholder, substitution);
                });

                Object.defineProperty(inputs, fieldName, {
                    value: content
                });

                break;
        }
    });

    Object.defineProperty(inputs, "basePdf", {
        value: substitutions.basePdf
    });

    template.basePdf = PdfMe.BLANK_PDF;

    return [inputs] as Types.TemplateInputs;
}

/*
    Receives a file from an <input type="file"> and transforms it into
    a PdfMe.Template object.
*/
export async function getTemplateFromJsonFile(file: File) {
    const template: PdfMeTypes.Template = JSON.parse(await FileService.readTextFile(file));

    PdfMe.checkTemplate(template);

    return template;
}