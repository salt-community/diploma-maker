import { StudentRequest, StudentResponse, StudentUpdateRequestDto, StudentsRequestDto } from "../util/types";

const apiUrl = import.meta.env.VITE_API_URL;



export async function getStudentsByKeyword(keyword: string): Promise<StudentResponse[]> {
    const response = await fetch(`${apiUrl}/api/students/%20/?keyword=${keyword}`);
    if (!response.ok) {
        throw new Error('Failed to get diplomas!');
    }
    const result = await response.json() as StudentResponse[];
    return result;
}
export async function getStudentById(guidId: string): Promise<StudentResponse> {
    const response = await fetch(`${apiUrl}/api/students/${guidId}`);
    if (!response.ok) {
        throw new Error('Failed to get diploma!');
    }
    const result = await response.json() as StudentResponse;
    return result;
}

export async function deleteStudentById(guidId: string): Promise<void> {
    const response = await fetch(`${apiUrl}/api/students/${guidId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.status === 404) 
        throw new Error('Diploma not found');
    if (!response.ok)
        throw new Error('Failed to delete diploma!');
}



export async function postMultipleStudents(diplomasRequest: StudentsRequestDto): Promise<StudentResponse[]> {
    const response = await fetch(`${apiUrl}/api/Students`, {
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

    const result = await response.json() as StudentResponse[];
    return result;
}

export async function updateSingleStudent(StudentRequest: StudentUpdateRequestDto): Promise<StudentResponse> {
    const response = await fetch(`${apiUrl}/api/Students`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(StudentRequest)
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Diploma not found!");
        }
        throw new Error("Failed to update diploma!");
    }

    const result = await response.json() as StudentResponse;
    return result;
}