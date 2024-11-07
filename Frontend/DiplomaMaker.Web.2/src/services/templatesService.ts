import { PdfMeTypes } from ".";
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