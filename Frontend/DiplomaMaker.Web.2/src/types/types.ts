export type TemplateSubstitutions = {
    text: Record<string, string>,
    images: Record<string, string>,
    qrCodes: Record<string, string>,
    basePdf: string
}

export type TemplateImageSubstitutions = {
    basePdf: string,
    images: string[]
    qrCodes: string[]
};

export type TemplateInputs = Record<string, unknown>[];