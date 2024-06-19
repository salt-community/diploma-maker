import { TemplateRequest, TemplateResponse } from "../util/types";

export async function getAllTemplates(): Promise<TemplateResponse[]> {
    const response = await fetch(`http://localhost:5258/api/template`);
    if (!response.ok)
        throw new Error("Failed to get templates!");
    const result = await response.json() as TemplateResponse[];
    return result;
}

export async function getTemplateById(id: string): Promise<TemplateResponse> {
    const response = await fetch(`http://localhost:5258/api/template/${id}`);
    if (!response.ok) {
        throw new Error('Failed to get Template!');
    }
    const result = await response.json() as TemplateResponse;
    return result;
}

export async function postTemplate(templateRequest: TemplateRequest): Promise<void> {
    const formattedRequest = {
        ...templateRequest,
    };

    const response = await fetch('http://localhost:5258/api/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedRequest)
    });

    if(response.status == 409)
        throw new Error("Either there is a conflict error, or this student has already earned a template in this bootcamp");
    if(response.status == 404)
        throw new Error("Bootcamp you are trying to add this template to, does not exist")
    if(response.status == 400){
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create new template due to bad request!")
    }
    if (!response.ok) {
        throw new Error('Failed to create new template!');
    }
}

export async function deleteTemplateById(id: number): Promise<void> {
    const response = await fetch(`http://localhost:5258/api/template/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 404) 
        throw new Error('Template not found');
    if (!response.ok)
        throw new Error('Failed to delete template!');
}