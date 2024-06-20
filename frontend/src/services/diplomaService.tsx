import { DiplomaRequest, DiplomaResponse, DiplomasRequestDto } from "../util/types";

const apiUrl = import.meta.env.VITE_API_URL;

export async function getDiplomasByKeyword(keyword: string): Promise<DiplomaResponse[]> {
    const response = await fetch(`${apiUrl}/api/diploma/%20/?keyword=${keyword}`);
    if (!response.ok) {
        throw new Error('Failed to get diplomas!');
    }
    const result = await response.json() as DiplomaResponse[];
    console.log(result);
    return result;
}

export async function getDiplomaById(guidId: string): Promise<DiplomaResponse> {
    const response = await fetch(`${apiUrl}/api/diploma/${guidId}`);
    if (!response.ok) {
        throw new Error('Failed to get diploma!');
    }
    const result = await response.json() as DiplomaResponse;
    return result;
}

export async function postDiploma(diplomaRequest: DiplomaRequest): Promise<void> {
    const formattedRequest = {
        ...diplomaRequest,
        // @ts-ignore
        graduationDate: diplomaRequest.graduationDate ? diplomaRequest.graduationDate.toISOString() : undefined
    };

    const response = await fetch(`${apiUrl}/api/diploma`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedRequest)
    });

    if(response.status == 409)
        throw new Error("Either there is a conflict error, or this student has already earned a diploma in this bootcamp");
    if(response.status == 404)
        throw new Error("Bootcamp you are trying to add this diploma to, does not exist")
    if(response.status == 400){
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create new diploma due to bad request!")
    }
    if (!response.ok) {
        throw new Error('Failed to create new diploma!');
    }
}


export async function deleteDiplomaById(guidId: string): Promise<void> {
    const response = await fetch(`${apiUrl}/api/diploma/${guidId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 404) 
        throw new Error('Diploma not found');
    if (!response.ok)
        throw new Error('Failed to delete diploma!');
}


export async function postSingleDiploma(diplomaRequest: DiplomaRequest): Promise<DiplomaResponse> {
    const response = await fetch(`${apiUrl}/api/diploma/single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diplomaRequest)
    });

    if (!response.ok) {
        if (response.status === 409) {
            throw new Error("This student has already earned a diploma in this bootcamp!");
        }
        throw new Error("Failed to post new diploma!");
    }

    const result = await response.json() as DiplomaResponse;
    return result;
}


export async function postMultipleDiplomas(diplomasRequest: DiplomasRequestDto): Promise<DiplomaResponse[]> {
    const response = await fetch(`${apiUrl}/api/diploma/many`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diplomasRequest)
    });

    if (!response.ok) {
        if (response.status === 409) {
            throw new Error("Some diplomas already exist!");
        }
        throw new Error("Failed to post diplomas!");
    }

    const result = await response.json() as DiplomaResponse[];
    return result;
}