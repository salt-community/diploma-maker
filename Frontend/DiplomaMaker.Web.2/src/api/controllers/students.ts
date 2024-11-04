import createClient from "openapi-fetch"
import type { paths } from "../open-api-schema";
import { StudentResponseDto, StudentUpdateRequestDto } from "../types";

const client = createClient<paths>({ baseUrl: "http://localhost:5258/api/" });

export async function updateStudents(guidId: string, request: StudentUpdateRequestDto) {
    const { data } = await client.PUT('/api/Students/{GuidID}', {
        params: {
            path: {
                GuidID: guidId,
            }
        },
        body: request
    });

    return data as StudentResponseDto;
}

export async function getStudents() {
    const { data } = await client.GET('/api/Students');

    return data as StudentResponseDto[];
}

export async function getStudentByGuidId(guidId: string) {
    const { data } = await client.PUT('/api/Students/{GuidID}', {
        params: {
            path: {
                GuidID: guidId,
            }
        },
    });

    return data as StudentResponseDto;
}

export async function deleteStudent(guidId: string) {
    await client.DELETE('/api/Students/{guidId}', {
        params: {
            path: {
                guidId,
            }
        },
    });
}

export async function getStudentByVerificationCode(verificationCode: string) {
    const { data } = await client.GET('/api/Students/verificationCode/{verificationCode}', {
        params: {
            path: {
                verificationCode
            }
        },
    });

    return data as StudentResponseDto;
}