type BaseEntity = {
    guid?: string
}

export type NamedEntity = BaseEntity & {
    name: string
};

export type StringFile = NamedEntity & {
    mimeType: string,
    content: string
}

export type Template = BaseEntity & {
    basePdfGuid?: string
}

export type Diploma = BaseEntity & {
    studentGuid: string,
    bootcampGuid: string,
    templateGuid: string
}

export type FullDiploma = {
    diplomaGuid: string,
    studentName: string,
    trackName: string,
    graduationDate: Date,
    templateJson: string,
    basePdf: string
}