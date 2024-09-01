import { apiEndpointParameters, StudentRequestNew, StudentResponse, StudentUpdateRequestDto,  } from "../util/types";

export async function getStudentsByKeyword(apiParameters: apiEndpointParameters, keyword: string): Promise<StudentResponse[]> {
    const response = await fetch(`${apiParameters.endpointUrl}/api/students/?keyword=${keyword}`, {
        headers: {'Authorization': `Bearer ${apiParameters.token()}` }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch students!');
    }
    const result = await response.json() as StudentResponse[];
    return result;
}

export async function getStudentById(apiParameters: apiEndpointParameters, guidId: string): Promise<StudentResponse> {
    const response = await fetch(`${apiParameters.endpointUrl}/api/students/${guidId}`, {
        headers: {'Authorization': `Bearer ${apiParameters.token()}` }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch student!');
    }
    const result = await response.json() as StudentResponse;
    return result;
}

export async function getStudentByVerificationCode(apiParameters: apiEndpointParameters, verificationCode: string): Promise<StudentResponse> {
    const response = await fetch(`${apiParameters.endpointUrl}/api/students/verificationCode/${verificationCode}`,{
        headers: {'Authorization': `Bearer ${apiParameters.token()}` }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch student!');
    }
    const result = await response.json() as StudentResponse;
    return result;
}

export async function deleteStudentById(apiParameters: apiEndpointParameters, guidId: string): Promise<void> {
    const response = await fetch(`${apiParameters.endpointUrl}/api/students/${guidId}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${apiParameters.token()}` 
        }
    });

    if (response.status === 404) 
        throw new Error('Diploma not found');
    if (!response.ok)
        throw new Error('Failed to delete diploma!');
}

export async function updateSingleStudent(apiParameters: apiEndpointParameters, studentRequest: StudentUpdateRequestDto): Promise<StudentResponse> {
    const studentReq: StudentRequestNew = {
        name: studentRequest.studentName,
        email: studentRequest.emailAddress
    };

    const response = await fetch(`${apiParameters.endpointUrl}/api/students/${studentRequest.guidId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${apiParameters.token()}` 
        },
        body: JSON.stringify(studentReq)
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Student not found!');
        }
        throw new Error('Failed to update student!');
    }

    const result = await response.json() as StudentResponse;
    return result;
}