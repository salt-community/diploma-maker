import { apiEndpointParameters, BootcampRequest, BootcampResponse, FormDataUpdateRequest, studentImagePreview, StudentResponse,  } from "../util/types";

export async function postBootcamp(apiParameters: apiEndpointParameters, bootcampRequest: BootcampRequest): Promise<void> {
    const formattedRequest = {
        ...bootcampRequest,
        graduationDate: bootcampRequest.graduationDate? bootcampRequest.graduationDate.toISOString(): undefined
    };
    
    const response = await fetch (`${apiParameters.endpointUrl}/api/bootcamps`,{
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

export async function getBootcamps(apiParameters: apiEndpointParameters, setLoadingMessage: (message: string) => void): Promise<BootcampResponse[]> {
    setLoadingMessage('Fetching bootcamps...');
    const response = await fetch(`${apiParameters.endpointUrl}/api/Bootcamps`);
    if (!response.ok){
        const errorData = await response.json();
        setLoadingMessage(`Failed to load bootcamps!. ${errorData.message || 'Unknown error'}`)
        throw new Error("Failed to get bootcamps!")
    }

    const results = await response.json() as BootcampResponse[]

    return results;
}

export async function getBootcampById(apiParameters: apiEndpointParameters, guidId: string): Promise<BootcampResponse>{
    const response = await fetch(`${apiParameters.endpointUrl}/api/Bootcamps/${guidId}`);
    if (!response.ok){
        throw new Error("Failed to get bootcamp!")
    }

    const result = await response.json() as  BootcampResponse;
    
    return result;
}


export async function updateBootcamp(apiParameters: apiEndpointParameters, bootcampRequest: BootcampRequest): Promise<BootcampResponse>{
    const formattedRequest = {
        ...bootcampRequest,
        graduationDate: bootcampRequest.graduationDate? bootcampRequest.graduationDate.toISOString(): undefined
    };

    const response = await fetch(`${apiParameters.endpointUrl}/api/bootcamps/${bootcampRequest.guidId!}`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedRequest)
    })

    if (!response.ok){
        throw new Error("Failed to update bootcamp!")
    }

    return response.json()
}

export async function deleteBootcampById(apiParameters: apiEndpointParameters, guidId: string): Promise<void> {
    const response = await fetch(`${apiParameters.endpointUrl}/api/bootcamps/${guidId}`, {
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

export async function UpdateBootcampWithNewFormdata(apiParameters: apiEndpointParameters, FormDataUpdateRequest: FormDataUpdateRequest, guidId: string): Promise<BootcampResponse> {
    const response = await fetch(`${apiParameters.endpointUrl}/api/Bootcamps/dynamicfields/${guidId}`, {
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


export async function updateStudentPreviewImage(apiParameters: apiEndpointParameters, studentImagePreviewRequest: studentImagePreview): Promise<StudentResponse> {
    const formData = new FormData();
    formData.append('StudentGuidId', studentImagePreviewRequest.studentGuidId);
    formData.append('Image', studentImagePreviewRequest.image);

    const response = await fetch(`${apiParameters.endpointUrl}/api/Blob/UpdateStudentsPreviewImage`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
}



export async function updateBundledStudentsPreviewImages(apiParameters: apiEndpointParameters, studentImagePreviewRequests: studentImagePreview[]): Promise<StudentResponse[]> {
    const formData = new FormData();
    studentImagePreviewRequests.forEach((request, index) => {
        formData.append(`PreviewImageRequests[${index}].StudentGuidId`, request.studentGuidId);
        formData.append(`PreviewImageRequests[${index}].Image`, request.image);
    });

    const response = await fetch(`${apiParameters.endpointUrl}/api/Blob/UpdateBundledStudentsPreviewImages`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
}
