import { FileService, PdfMe, PdfMeTypes } from ".";
import { TemplateInputs, TemplateSubstitutions } from "../types/types";

export function substitutePlaceholders(template: PdfMeTypes.Template, substitutions: TemplateSubstitutions) {
    const inputs: Record<string, unknown> = {};
    const schema = template.schemas[0];

    Object.entries(schema).forEach(entry => {
        const fieldName = entry[1]['name'];
        let content = entry[1]['content'];

        Object.entries(substitutions).forEach(([placeholder, substitution]) => {
            content = content!.replace(placeholder, substitution);
        });

        Object.defineProperty(inputs, fieldName, {
            value: content
        });
    });

    return [inputs] as TemplateInputs;
}

export function substituteImageDataInTemplateWithPlaceholders(template: PdfMeTypes.Template, guids: string[]) {
    let guidIndex = 0;

    Object.entries(template.schemas[0]).forEach(entry => {
        if (guidIndex >= guids.length)
            return;

        const typeName = entry[1]['type'];
        if (typeName == 'image') {
            entry[1]['content'] = `{${guids[guidIndex]}}`;
            guidIndex++;
        }
    });

    return template;
}

export async function getTemplateFromJsonFile(file: File) {
    const template: PdfMeTypes.Template = JSON.parse(await FileService.readTextFile(file));
    PdfMe.checkTemplate(template);
    return template;
}