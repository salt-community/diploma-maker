import { StudentRequest, StudentResponse } from "./students"
import { TracksResponse } from "./tracks"

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
    track: TracksResponse;
    templateId: number;
    students: StudentResponse[];
}