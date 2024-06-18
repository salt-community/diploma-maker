export type displayMode = "form" | "viewer";

// diplomas

export type DiplomaRequest = {
    guidId?: string;
    studentName: string;
    bootcampGuidId: string;
}

export type DiplomaResponse = {
    guidId: string;
    studentName: string;
    bootcamp: BootcampInDiploma;
}

export type DiplomaInBootcamp = {
    guidId: string;
    studentName: string;
}

// bootcamps

export type BootcampInDiploma = {
    guidId: string;
    name: string;
    graduationDate: Date;
}
export type BootcampRequest = {
    guidId?: string;
    name: string;
    graduationDate?: Date;
}
export type BootcampResponse = {
    guidId: string;
    name: string;
    graduationDate: Date;
    diplomas: DiplomaInBootcamp[];
}

export type SaltData = {
    classname: string;
    datestart?: string;
    dategraduate: string;
    names: string[];
};

export type DiplomasRequestDto = {
    diplomas: DiplomaRequest[];
}