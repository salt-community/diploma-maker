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
    substitutions: Types.TemplateSubstitutions) {

    const inputs: Record<string, unknown> = {};

    Object.entries(template.schemas[0]).forEach(entry => {
        const fieldName = entry[1]['name'];
        const typeName = entry[1]['type'];
        let content = entry[1]['content'];

        const imageIndex = 0;

        switch (typeName) {
            case 'text':
                Object.entries(substitutions.text).forEach(([placeholder, substitution]) => {
                    content = content!.replace(placeholder, substitution);
                });

                Object.defineProperty(inputs, fieldName, {
                    value: content
                });

                break;

            case 'image':
                Object.defineProperty(inputs, fieldName, {
                    value: substitutions.images[imageIndex]
                });

                break;
        }
    });

    Object.defineProperty(inputs, "basePdf", {
        value: substitutions.basePdf
    });

    return [inputs] as Types.TemplateInputs;
}

/*
    Accepts a PdeMe Template created in the designer and
    removes all dynamic non-text content and replaces it
    with guid placeholders.

    This is used to remove direct dependencies from a template
    to its image content, minifying its size for storage in the backend.
*/
export function substituteContentWithPlaceholders(
    template: PdfMeTypes.Template,
    substitutions: Types.TemplateImageSubstitutions) {

    let imageGuidIndex = 0;

    Object.entries(template.schemas[0]).forEach(entry => {
        if (imageGuidIndex >= substitutions.images[imageGuidIndex].length)
            return;

        const typeName = entry[1]['type'];
        if (typeName == 'image') {
            entry[1]['content'] = `{${substitutions.images[imageGuidIndex]}}`;
            imageGuidIndex++;
        }
    });

    template.basePdf = `{${substitutions.basePdf}`;

    return template;
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