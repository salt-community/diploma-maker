import type { components } from "./../open-api-schema";
import { StudentResponse } from './students';

export type BootcampRequest = {
    guidId?: string;
    name?: string;
    graduationDate?: Date;
    trackId: number;
}

export type BootcampRequestUpdate = {
    students: Dtos.StudentRequest[],
    templateId: number
}

export type BootcampResponse = {
    guidId: string;
    name: string;
    graduationDate: Date;
    templateId: number;
    students: Student[];
    track: TrackResponse;
    displayName?: string;
}