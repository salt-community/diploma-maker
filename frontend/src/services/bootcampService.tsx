import { delay } from "../util/helper";
import { BootcampRequest, BootcampResponse } from "../util/types";
import { getTemplatePdfFile } from "./fileService";

const apiUrl = import.meta.env.VITE_API_URL;

export async function postBootcamp(bootcampRequest: BootcampRequest): Promise<void> {
    const formattedRequest = {
        ...bootcampRequest,
        graduationDate: bootcampRequest.graduationDate? bootcampRequest.graduationDate.toISOString(): undefined
    };
    const response = await fetch (`${apiUrl}/api/bootcamps`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedRequest)
    });
    if(response.status == 409){
        throw new Error("A bootcamp with the same name already exist!")
    }
    if (!response.ok)
        throw new Error("Failed to post new bootcamp!")
}
export async function getBootcamps(setLoadingMessage: (message: string) => void): Promise<BootcampResponse[]> {
    setLoadingMessage('Fetching bootcamps...');
    const response = await fetch(`${apiUrl}/api/Bootcamps`);
    if (!response.ok)
        throw new Error("Failed to get bootcamps!")
    const results = await response.json() as BootcampResponse[]

    return results;
}

export async function getBootcampById(guidId: string): Promise<BootcampResponse>{
    const response = await fetch(`${apiUrl}/api/Bootcamps/${guidId}`);
    if (!response.ok)
        throw new Error("Failed to get bootcamp!")
    const result = await response.json() as  BootcampResponse;
    
    return result;
}


export async function updateBootcamp(bootcampRequest: BootcampRequest): Promise<void>{
    const formattedRequest = {
        ...bootcampRequest,
        graduationDate: bootcampRequest.graduationDate? bootcampRequest.graduationDate.toISOString(): undefined
    };
    console.log(formattedRequest);
    const response = await fetch(`${apiUrl}/api/bootcamps/${bootcampRequest.guidId!}`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedRequest)
    })
    if (!response.ok)
        throw new Error("Failed to update bootcamp!")
}

export async function deleteBootcampById(guidId: string): Promise<void> {
    const response = await fetch(`${apiUrl}/api/bootcamps/${guidId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        if (response.status === 404) 
            throw new Error('Bootcamp not found');
        throw new Error('Failed to delete bootcamp!');
    }
}
