export type displayMode = "form" | "viewer";

// diplomas

export type DiplomaRequest = {
    id: string;
    graduationDate: Date;
    studentName: string;
    bootcampId: string;
}

export type DiplomaResponse = {
    id: string;
    graduationDate: Date;
    studentName: string;
    bootcamp: BootcampInDiploma;
}

export type DiplomaInBootcamp = {
    id: string;
    graduationDate: Date;
    studentName: string;
}

// bootcamps

export type BootcampInDiploma = {
    id: string;
    name: string;
    startDate: Date;
}
export type BootcampRequest = {
    id: string;
    name: string;
    startDate: Date;
}
export type BootcampResponse = {
    id: string;
    name: string;
    startDate: Date;
    diplomas: DiplomaInBootcamp;
}