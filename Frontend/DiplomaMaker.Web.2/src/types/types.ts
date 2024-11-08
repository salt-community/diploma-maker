export type TemplateSubstitutions = {
    text: Record<string, string>,
    images: Record<string, string>,
    basePdf: string
}

export type TemplateImageSubstitutions = {
    basePdf: string,
    images: string[]
};

export type TemplateInputs = Record<string, unknown>[];