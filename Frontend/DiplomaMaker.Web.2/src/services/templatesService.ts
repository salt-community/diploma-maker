import { PdfMeTypes } from ".";
import { TemplateInputs, TemplateSubstitutions } from "../types/types";

export function substitutePlaceholders(template: PdfMeTypes.Template, substitutions: TemplateSubstitutions) {
    console.log(substitutions);
    const inputs: Record<string, unknown> = {};

    Object.entries(template.schemas[0]).forEach(entry => {
        const fieldName = entry[1]['name'];
        let content = entry[1]['content'];

        Object.entries(substitutions[0]).forEach(([placeholder, substitution]) => {
            content = content!.replace(placeholder, substitution);
        });

        console.log(content);

        Object.defineProperty(inputs, fieldName, {
            value: content
        });
        // const record: Record<string, unknown> = {};
        // record[fieldName] = content;
    });

    console.log(inputs[0]);

    return [inputs] as TemplateInputs;
}