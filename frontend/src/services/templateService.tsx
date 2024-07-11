import { TemplateRequest, TemplateResponse } from "../util/types";
import { getTemplatePdfFile } from "./fileService";

const apiUrl = import.meta.env.VITE_API_URL;

export async function getAllTemplates(): Promise<TemplateResponse[]> {
    const response = await fetch(`${apiUrl}/api/templates`);
    if (!response.ok)
        throw new Error("Failed to get templates!");
    const results = await response.json() as TemplateResponse[];

    await Promise.all(results.map(async result => {
        result.basePdf = await getTemplatePdfFile(result.basePdf, result.lastUpdated);
    }));

    return results;
}



export async function getTemplateById(id: string): Promise<TemplateResponse> {
    const response = await fetch(`${apiUrl}/api/templates/${id}`);
    if (!response.ok) {
        throw new Error('Failed to get Template!');
    }
    const result = await response.json() as TemplateResponse;
    result.basePdf = await getTemplatePdfFile(result.basePdf, result.lastUpdated);

    return result;
}

export async function postTemplate(templateRequest: TemplateRequest): Promise<void> {
    
    const formattedRequest = {
        ...templateRequest,
    };

    const response = await fetch(`${apiUrl}/api/templates`, {
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
    const response = await fetch(`${apiUrl}/api/templates/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 404) 
        throw new Error('Template not found');
    if (!response.ok)
        throw new Error('Failed to delete template!');
}


export async function putTemplate(id: number, templateRequest: TemplateRequest): Promise<TemplateResponse> {
    // const formattedRequest = {
    //     ...templateRequest,
    // };

    // const response = await fetch(`${apiUrl}/api/templates/${id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formattedRequest)
    // });
    localStorage.removeItem(`pdf_${templateRequest.templateName}.pdf`);
    const basePdfBlob = stringToBlob(templateRequest.basePdf, 'application/pdf');

    const formData = new FormData();

    Object.entries(templateRequest).forEach(([key, value]) => {
        if (key === 'basePdf') {
            formData.append(key, basePdfBlob, 'basePdf.pdf');
        } else if (value !== undefined) {
            formData.append(key, value instanceof Object ? JSON.stringify(value) : value);
        }
    });

    const response = await fetch(`${apiUrl}/api/templates/${id}`, {
        method: 'PUT',
        body: formData
    });

    if (response.status === 404) {
        throw new Error("Template not found");
    }
    if (!response.ok) {
        throw new Error("Failed to update template");
    }

    const result = await response.json() as TemplateResponse;
    return result;
}

function stringToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}