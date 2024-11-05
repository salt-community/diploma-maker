import { TrackResponse } from "../types"
import { StudentRequest, StudentResponse } from "./students"

export type BootcampRequest = {
    trackId: number,
    graduationDate: Date
}

export type BootcampRequestUpdate = BootcampRequest & {
    students: StudentRequest[],
    templateId: number
}

export type BootcampResponse = {
    guidId: string;
    graduationDate: Date;
    name: string;
    track: TrackResponse;
    templateId: number;
    students: StudentResponse[];
}