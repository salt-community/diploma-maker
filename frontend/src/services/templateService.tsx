import { TemplateResponse } from "../util/types";

export async function getTemplates(): Promise<TemplateResponse[]> {
    const response = await fetch(`http://localhost:5258/api/template`);
    if (!response.ok)
        throw new Error("Failed to get templates!");
    const result = await response.json() as TemplateResponse[];
    return result;
}