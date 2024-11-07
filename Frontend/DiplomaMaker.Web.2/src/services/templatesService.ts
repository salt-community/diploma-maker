import { Template } from "@pdfme/common";

export function substitutePlaceholders(template: Template, substitutions: Record<string, string>[]) {
    return Object.entries(template).map(([schemaName, content]) => {
        let stringValue = JSON.stringify(content);

        substitutions.forEach(substitution => {
            stringValue = stringValue.replace(substitution[0], substitution[1]);
        });

        const record: Record<string, unknown> = {};
        record[schemaName] = stringValue;

        return record;
    });
}