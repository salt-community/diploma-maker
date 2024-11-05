import type { components } from "./open-api-schema";

export type DiplomaSnapshotResponseDto = Required<components['schemas']['DiplomaSnapshotResponseDto']>;
export type FontTypeDto = Required<components['schemas']['FontType']>;
export type FontType = 'Regular' | 'Bold' | 'Italic';
export type MakeActiveSnapshotRequestDto = Required<components['schemas']['MakeActiveSnapshotRequestDto']>;
export type PreviewImageRequestDto = Required<components['schemas']['PreviewImageRequestDto']>;



export type TemplatePostRequestDto = Required<components['schemas']['TemplatePostRequestDto']>;
export type TemplateRequestDto = Required<components['schemas']['TemplateRequestDto']>;
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
export type TemplateResponseDto = Required<components['schemas']['TemplateResponseDto']>;
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
export type TemplateStyle = Required<components['schemas']['TemplateStyle']>;
export type TemplatesResponseDto = Required<components['schemas']['TemplatesResponseDto']>;

export type TracksResponseDto = Required<components['schemas']['TracksResponseDto']>;
export type TrackResponse = {
    id: number;
    name?: string;
    tag?: string,
    bootcamps : BootcampResponse[] 
}

export type UserFontRequestDto = Required<components['schemas']['UserFontRequestDto']>;
export type UserFontRequestDto = {
    Name: string;
    FontType: FontType;
    File: Blob | null;
}

export type UserFontResponseDto = Required<components['schemas']['UserFontResponseDto']>;
export type UserFontResponse = {
    name: string;
    fontType: FontType;
    fileName: string;
    file?: Blob;
    fileUrl?: string;
}

export type displayMode = "form" | "viewer";

// Students


export type FormDataUpdateRequest = {
    students: StudentRequest[];
    templateId: number;
}






// bootcamps






// Internal Data
export type SaltData = {
    guidId : string;
    classname: string;
    dategraduate: string;
    students: Student[];
    template: TemplateResponse;
    displayName?: string;
};

// Template





export type EmailSendRequest = {
    guidId: string;
    file: Blob;
    title: string;
    description: string;
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
    basePdfName?: string;
    templateLastUpdated: Date;
    active?: Boolean;
}

export type HistorySnapshotBundledData = {
    HistorySnapShots: HistorySnapshotResponse[]
}

export type MakeActiveSnapshotRequestDto = {
    Ids: number[];
    StudentGuidIds: string[];
}

// Preview Images
export type studentImagePreview = {
    studentGuidId: string,
    image: string,
}

export type pdfGenerationResponse = {
    pdfFiles: Uint8Array[],
    bundledPdfsDisplayObject: Blob,
}

export type apiEndpointParameters = {
    endpointUrl: string,
    token: () => string,
}

//User Fonts







export type pdfSize = {
    width: number;
    height: number;
}