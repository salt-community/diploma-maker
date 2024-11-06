import { TemplateFieldStyle } from "./templates"

export type SnapshotResponse = {
    id?: number,
    generatedAt?: Date,
    bootcampName: string,
    bootcampGuid?: string,
    bootcampGraduationDate: Date,
    studentGuid?: string,
    studentName: string,
    verificationCode: string,
    templateName: string,
    footer: string,
    footerStyling?: TemplateFieldStyle,
    intro: string,
    introStyling?: TemplateFieldStyle,
    main: string,
    mainStyling?: TemplateFieldStyle,
    link: string,
    linkStyling?: TemplateFieldStyle,
    basePdf: string,
    templateLastUpdated?: Date,
    active?: boolean
}

export type MakeSnapshotActiveRequest = {
    ids: number[],
    studentGuids: string[]
}