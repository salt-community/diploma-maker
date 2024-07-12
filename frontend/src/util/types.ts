export type displayMode = "form" | "viewer";

// Students
export type StudentRequest = {
    guidId?: string;
    name: string;
    email?: string;
}

export type FormDataUpdateRequest = {
    students: StudentRequest[];
    templateId: number;
}

export type StudentUpdateRequestDto = {
    guidId: string;
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
    templateId: number;
    students: Student[];
}

// Internal Data
export type SaltData = {
    guidId : string;
    classname: string;
    dategraduate: string;
    students: Student[];
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
    lastUpdated?: Date;
}

export type TemplateRequest = {
    templateName: string;
    footer: string;
    footerStyling?: Style;
    intro: string;
    introStyling?: Style;
    main: string;
    mainStyling?: Style;
    basePdf?: string;
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

export type Font = {
    fallback: boolean;
    label: string;
    url: string;
    data: object;
};
  
export type Fonts = {
    [key: string]: Font;
};


export type TemplateInstanceStyle = {
    positionX: number | null;
    positionY: number | null;
    sizeWidth: number | null;
    sizeHeight: number | null;
    align: string | null;
    fontSize: number | null;
    font: string | null;
    fontColor: string | null;
  };