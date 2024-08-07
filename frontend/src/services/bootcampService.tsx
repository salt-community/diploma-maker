import { BootcampRequest, BootcampResponse, FormDataUpdateRequest,  } from "../util/types";

export async function postBootcamp(apiUrl: string, bootcampRequest: BootcampRequest): Promise<void> {
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
    if (!response.ok){
        throw new Error("Failed to post new bootcamp!")
    }
}

export async function getBootcamps(apiUrl: string, setLoadingMessage: (message: string) => void): Promise<BootcampResponse[]> {
    setLoadingMessage('Fetching bootcamps...');
    const response = await fetch(`${apiUrl}/api/Bootcamps`);
    if (!response.ok){
        const errorData = await response.json();
        setLoadingMessage(`Failed to load bootcamps!. ${errorData.message || 'Unknown error'}`)
        throw new Error("Failed to get bootcamps!")
    }

    const results = await response.json() as BootcampResponse[]

    return results;
}

export async function getBootcampById(apiUrl: string, guidId: string): Promise<BootcampResponse>{
    const response = await fetch(`${apiUrl}/api/Bootcamps/${guidId}`);
    if (!response.ok){
        throw new Error("Failed to get bootcamp!")
    }

    const result = await response.json() as  BootcampResponse;
    
    return result;
}


export async function updateBootcamp(apiUrl: string, bootcampRequest: BootcampRequest): Promise<void>{
    const formattedRequest = {
        ...bootcampRequest,
        graduationDate: bootcampRequest.graduationDate? bootcampRequest.graduationDate.toISOString(): undefined
    };

    console.log("Request!");
    console.log(formattedRequest);

    const response = await fetch(`${apiUrl}/api/bootcamps/${bootcampRequest.guidId!}`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedRequest)
    })

    if (!response.ok){
        throw new Error("Failed to update bootcamp!")
    }
        
}

export async function deleteBootcampById(apiUrl: string, guidId: string): Promise<void> {
    const response = await fetch(`${apiUrl}/api/bootcamps/${guidId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        if (response.status === 404){
            throw new Error('Bootcamp not found');
        }
        throw new Error('Failed to delete bootcamp!');
    }
}

export async function UpdateBootcampWithNewFormdata(apiUrl: string, FormDataUpdateRequest: FormDataUpdateRequest, guidId: string): Promise<BootcampResponse> {
    const response = await fetch(`${apiUrl}/api/Bootcamps/dynamicfields/${guidId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(FormDataUpdateRequest)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData);
    }
    const result = await response.json()
    return result;
}

