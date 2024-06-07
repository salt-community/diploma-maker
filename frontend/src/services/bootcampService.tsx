import { BootcampInDiploma, BootcampRequest, BootcampResponse } from "../util/types";

export async function getBootcamps(): Promise<BootcampResponse[]>{
    const response = await fetch(`http://localhost:5258/api/bootcamp`);
    if (!response.ok)
        throw new Error("Failed to get bootcamps!")
    const result = await response.json() as BootcampResponse[]
    // console.table(result);
    return result;
}

export async function getBootcampById(guidId: string): Promise<BootcampResponse>{
    const response = await fetch(`http://localhost:5258/api/bootcamp/${guidId}`);
    if (!response.ok)
        throw new Error("Failed to get bootcamp!")
    const result = await response.json() as  BootcampResponse;
    // console.log(result);
    return result;
}

export async function postBootcamp(bootcampRequest: BootcampRequest): Promise<void> {
    const formattedRequest = {
        ...bootcampRequest,
        startDate: bootcampRequest.startDate? bootcampRequest.startDate.toISOString(): undefined
    };
    const response = await fetch (`http://localhost:5258/api/bootcamp`,{
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

export async function deleteBootcampById(guidId: string): Promise<void> {
    const response = await fetch(`http://localhost:5258/api/bootcamp/${guidId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        if (response.status === 404) 
            throw new Error('Bootcamp not found');
        throw new Error('Failed to delete bootcamp!');
    }
}