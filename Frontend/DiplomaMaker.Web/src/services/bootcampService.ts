/*
BootcampService

A collection of methods that supports managing bootcamps
(necessary objects for sending out email in batches and storing diploma records)
*/

import { StringService } from '@/services';

export namespace BootcampTypes {
    export type Student = {
        name: string;
        email: string;
    };

    export type Bootcamp = {
        track: string;
        graduationDate: Date;
        students: Student[];
    };

    export type FormBootcamp = {
        track: string;
        graduationDate: string;
        students: Student[];
    }
}

export const defaultStudent: BootcampTypes.Student = {
    name: 'Student Name',
    email: "student.name@appliedtechnology.se"
}

export const defaultBootcamp: BootcampTypes.Bootcamp = {
    track: "</Salt>",
    graduationDate: new Date(Date.now()),
    students: [defaultStudent]
}

export const defaultFormBootcamp = bootcampToFormBootcamp(defaultBootcamp);

export function bootcampToFormBootcamp(bootcamp: BootcampTypes.Bootcamp) {
    return {
        ...bootcamp,
        graduationDate: StringService.formatDate_YYYY_mm_dd(bootcamp.graduationDate)
    } as BootcampTypes.FormBootcamp;
}

export function formBootcampToBootcamp(formBootcamp: BootcampTypes.FormBootcamp) {
    return {
        ...formBootcamp,
        graduationDate: new Date(formBootcamp.graduationDate)
    } as BootcampTypes.Bootcamp;
}
