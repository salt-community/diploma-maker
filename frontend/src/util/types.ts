export type displayMode = "form" | "viewer";

// Students
export type StudentRequest = {
    guidId?: string;
    name: string;
    email?: string;
}

export type StudentsRequestDto = {
    students: StudentRequest[];
    bootcampGuidId: string;
}

export type StudentUpdateRequestDto = {
    guidId : string;
    studentName: string;
    emailAddress: string;
}

export type StudentResponse = {
    guidId: string;
    studentName: string;
    email: string;
}

export type Student = {
    guidId?: string;
    name: string;
    email: string;
}

// bootcamps

export type BootcampRequest = {
    guidId?: string;
    name: string;
    graduationDate?: Date;
}
export type BootcampResponse = {
    guidId: string;
    name: string;
    graduationDate: Date;
    diplomaTemplate: TemplateResponse;
    students: Student[];
}
// Internal Data
export type SaltData = {
    guidId: string;
    classname: string;
    dategraduate: string;
    diplomaTemplate: TemplateResponse;
    students: Student[];
};

// Template
export type TemplateResponse = {
    id: number;
    name: string;
    footer: string;
    footerStyling?: Style;
    intro: string;
    introStyling?: Style;
    main: string;
    mainStyling?: Style;
    basePdf: string;
}

export type TemplateRequest = {
    templateName: string;
    footer: string;
    footerStyling?: Style;
    intro: string;
    introStyling?: Style;
    main: string;
    mainStyling?: Style;
    basePdf: string;
}

export type EmailSendRequest = {
    guidId: string;
    file: Blob;
}

export type XYPosition = {
    x: number;
    y: number;
}

export type Size = {
    width: number | null;
    height: number | null;
}

export type Style = {
    id: number;
    xPos?: number;
    yPos?: number;
    width?: number;
    height?: number;
    fontSize?: number;
    fontColor?: string;
    fontName?: string;
    alignment?: string;
}