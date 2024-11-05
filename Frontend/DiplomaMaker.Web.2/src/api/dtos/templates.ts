export type TemplatePostRequest = {
    templateName: string
}

export type TemplateFieldStyle = {
    id: number,
    xPos?: number,
    yPos?: number,
    width?: number,
    height?: number,
    fontSize?: number,
    fontColor?: string,
    fontName?: string,
    alignment?: string
}

export type TemplateRequest = {
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
    pdfBackgroundLastUpdated?: boolean
}

export type TemplateResponse = TemplateRequest & {
    id: number,
    lastUpdated?: Date
}

export type TemplatesResponse = {
    templates: TemplateResponse[]
}