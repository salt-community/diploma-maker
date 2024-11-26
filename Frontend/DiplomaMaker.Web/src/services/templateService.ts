/*
    TemplateService
    
    A collection of methods that manipulates PdfMe templates
    and pdf generation.
*/

import { BLANK_PDF } from '@pdfme/common';

import { FileService, PdfMeService } from '@/services';
import type { BackendTypes, PdfMeTypes } from '@/services';

//Types
export namespace TemplateTypes {
    export type Substitions = {
        studentName: string,
        track: string,
        graduationDate: string,
        qrLink: string
    }
}

export const defaultTemplate: PdfMeTypes.Template = {
    basePdf: BLANK_PDF,
    schemas: [[]],
};

export const placeholders = {
    studentName: "{studentName}",
    track: "{track}",
    graduationDate: "{graduationDate}",
    qrLink: "{qrLink}"
}

/*
    Accepts a PdfMe Template with placeholders and 
    constructs an input object to be used with PdfMe.generate()
    when generating pdfs.
*/
export function substitutePlaceholdersWithContent(
    template: PdfMeTypes.Template,
    substitutions: TemplateTypes.Substitions) {

    const inputs: Record<string, unknown> = {};

    console.log(template);
    console.log(substitutions);

    Object.entries(template.schemas[0]).forEach(entry => {
        const fieldName = entry[1]['name'];
        const typeName = entry[1]['type'];
        let content = entry[1]['content'];

        switch (typeName) {
            case 'qrcode':
            case 'text':
                Object.entries(placeholders).forEach(([key, placeholder]) => {
                    content = content!.replace(placeholder, substitutions[key as keyof typeof placeholders])
                });

                inputs[fieldName] = content;

                break;
            case 'image':
                inputs[fieldName] = content;

                break;
        }
    });

    return [inputs] as Record<string, any>[];
}

/*
    Receives a file from an <input type="file"> and transforms it into
    a PdfMe.Template object.
*/
export async function getTemplateFromJsonFile(file: File) {
    const template: PdfMeTypes.Template = JSON.parse(await FileService.readTextFile(file));

    PdfMeService.checkTemplate(template);

    return template;
}

export function backendTemplateToPdfMeTemplate(template: BackendTypes.Template) {
    return JSON.parse(template.templateJson) as PdfMeTypes.Template;
}