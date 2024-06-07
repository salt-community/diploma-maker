export type displayMode = "form" | "viewer";

// diplomas

export type DiplomaRequest = {
    guidId: string;
    graduationDate: Date;
    studentName: string;
    bootcampId: string;
}

export type DiplomaResponse = {
    guidId: string;
    graduationDate: Date;
    studentName: string;
    bootcamp: BootcampInDiploma;
}

export type DiplomaInBootcamp = {
    guidId: string;
    graduationDate: Date;
    studentName: string;
}

// bootcamps

export type BootcampInDiploma = {
    guidId: string;
    name: string;
    startDate: Date;
}
export type BootcampRequest = {
    guidId: string;
    name: string;
    startDate: Date;
}
export type BootcampResponse = {
    guidId: string;
    name: string;
    startDate: Date;
    diplomas: DiplomaInBootcamp;
}