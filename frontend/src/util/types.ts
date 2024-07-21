export type displayMode = "form" | "viewer";

// Students
export type StudentRequest = {
    guidId?: string;
    name: string;
    email?: string;
    verificationCode: string;
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
    name: string;
    email: string;
    verificationCode: string;
}

export type Student = {
    guidId?: string;
    name: string;
    email: string;
    verificationCode?: string;
    lastGenerated?: Date;
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
    link: string;
    linkStyling?: Style;
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
    link?: string;
    linkStyling?: Style;
    basePdf?: string;
    PdfBackgroundLastUpdated?: Date;
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


export type StudentRequestNew = {
    name: string,
    email: string
}

export type HistorySnapshotResponse = {
    id: number;
    generatedAt: Date;
    bootcampName: string;
    bootcampGuidId: string;
    bootcampGraduationDate: Date;
    studentGuidId: string;
    studentName: string;
    verificationCode: string;
    templateName: string;
    footer: string;
    footerStyling: Style;
    intro: string;
    introStyling: Style;
    main: string;
    mainStyling: Style;
    link: string;
    linkStyling: Style;
    basePdf: string;
    templateLastUpdated: Date;
    status?: Boolean;
}

export type HistorySnapshotBundledData = {
    HistorySnapShots: HistorySnapshotResponse[]
}