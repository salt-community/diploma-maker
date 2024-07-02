export type displayMode = "form" | "viewer";

// diplomas
export type DiplomaRequest = {
    guidId?: string;
    studentName: string;
    EmailAddress?: string;
    bootcampGuidId: string;
}

export type DiplomaUpdateRequestDto = {
    guidId: string;
    studentName: string;
    emailAddress: string;
}

export type DiplomaResponse = {
    guidId: string;
    studentName: string;
    bootcamp: BootcampInDiploma;
}

export type Student = {
    guidId: string;
    name: string;
    email: string;
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
    diplomaTemplate: TemplateResponse;
    students: Student[];
}

export type DiplomasRequestDto = {
    diplomas: DiplomaRequest[];
}

export type PersonalStudentData = {
    name: string;
    email?: string;
}

// Internal Data
export type SaltData = {
    classname: string;
    dategraduate: string;
    students: PersonalStudentData[];
    template: TemplateResponse;
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
    x: number | null;
    y: number | null;
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