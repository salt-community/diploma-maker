import { FileService, PdfMe, PdfMeTypes } from ".";
import { Types } from "../types";

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

export async function getTemplateFromJsonFile(file: File) {
    const template: PdfMeTypes.Template = JSON.parse(await FileService.readTextFile(file));

    PdfMe.checkTemplate(template);

    return template;
}