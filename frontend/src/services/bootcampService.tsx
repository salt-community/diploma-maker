import { delay } from "../util/helper";
import { BootcampRequest, BootcampResponse, FormDataUpdateRequest, studentImagePreview, StudentResponse,  } from "../util/types";

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


export async function updateBootcamp(apiUrl: string, bootcampRequest: BootcampRequest): Promise<BootcampResponse>{
    const formattedRequest = {
        ...bootcampRequest,
        graduationDate: bootcampRequest.graduationDate? bootcampRequest.graduationDate.toISOString(): undefined
    };

    const response = await fetch(`${apiUrl}/api/bootcamps/${bootcampRequest.guidId!}`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedRequest)
    })

    if (!response.ok){
        throw new Error("Failed to update bootcamp!")
    }

    return response.json()
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


export async function updateStudentPreviewImage(apiUrl: string, studentImagePreviewRequest: studentImagePreview): Promise<StudentResponse> {
    const formData = new FormData();
    
    // Append StudentGuidId as usual
    formData.append('StudentGuidId', studentImagePreviewRequest.studentGuidId);
    
    // Append the Base64 string as the image
    formData.append('Image', studentImagePreviewRequest.image); // No need for filename here, it's already Base64

    // Optional: Log FormData entries for debugging
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }

    const response = await fetch(`${apiUrl}/api/Blob/UpdateStudentsPreviewImage`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
}



export async function updateBundledStudentsPreviewImages(apiUrl: string, studentImagePreviewRequests: studentImagePreview[]): Promise<StudentResponse[]> {
    const formData = new FormData();

    studentImagePreviewRequests.forEach((request, index) => {
        // Append StudentGuidId as usual
        formData.append(`PreviewImageRequests[${index}].StudentGuidId`, request.studentGuidId);

        // Append the Base64 string as the image
        formData.append(`PreviewImageRequests[${index}].Image`, request.image); // No filename, since it's Base64
    });

    const response = await fetch(`${apiUrl}/api/Blob/UpdateBundledStudentsPreviewImages`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
}
