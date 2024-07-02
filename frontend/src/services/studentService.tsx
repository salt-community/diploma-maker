import { StudentRequest, StudentResponse, StudentUpdateRequestDto, StudentsRequestDto } from "../util/types";

const apiUrl = import.meta.env.VITE_API_URL;


export async function postDiploma(StudentRequest: StudentRequest): Promise<void> {
    const formattedRequest = {
        ...StudentRequest,
        // @ts-ignore
        graduationDate: StudentRequest.graduationDate ? StudentRequest.graduationDate.toISOString() : undefined
    };

    const response = await fetch(`${apiUrl}/api/student`, {
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