import { StudentRequestNew, StudentResponse, StudentUpdateRequestDto,  } from "../util/types";

export async function getStudentsByKeyword(apiUrl: string, keyword: string): Promise<StudentResponse[]> {
    const response = await fetch(`${apiUrl}/api/students/?keyword=${keyword}`);
    if (!response.ok) {
        throw new Error('Failed to fetch students!');
    }
    const result = await response.json() as StudentResponse[];
    return result;
}

export async function getStudentById(apiUrl: string, guidId: string): Promise<StudentResponse> {
    const response = await fetch(`${apiUrl}/api/students/${guidId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch student!');
    }
    const result = await response.json() as StudentResponse;
    return result;
}

export async function getStudentByVerificationCode(apiUrl: string, verificationCode: string): Promise<StudentResponse> {
    const response = await fetch(`${apiUrl}/api/students/verificationCode/${verificationCode}`);
    if (!response.ok) {
        throw new Error('Failed to fetch student!');
    }
    const result = await response.json() as StudentResponse;
    return result;
}

export async function deleteStudentById(apiUrl: string, guidId: string): Promise<void> {
    const response = await fetch(`${apiUrl}/api/students/${guidId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 404) 
        throw new Error('Diploma not found');
    if (!response.ok)
        throw new Error('Failed to delete diploma!');
}

export async function updateSingleStudent(apiUrl: string, studentRequest: StudentUpdateRequestDto): Promise<StudentResponse> {
    const studentReq: StudentRequestNew = {
        name: studentRequest.studentName,
        email: studentRequest.emailAddress
    };

    const response = await fetch(`${apiUrl}/api/students/${studentRequest.guidId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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