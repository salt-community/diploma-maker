type BaseEntity = {
    guid?: string
}

export type NamedEntity = BaseEntity & {
    name: string
};

export type Track = NamedEntity;

export type Student = NamedEntity & {
    enail: string
}

export type StringFile = NamedEntity & {
    mimeType: string,
    content: string
}

export type Template = BaseEntity & {
    basePdfGuid?: string
}

export type Bootcamp = BaseEntity & {
    graduationDate: Date,
    studentGuids: string[],
    trackGuid: string
}

export type Diploma = BaseEntity & {
    studentGuid: string,
    bootcampGuid: string,
    templateGuid: string
}

export type FullDiploma = {
    studentName: string,
    trackName: string,
    graduationDate: Date,
    templateJson: string
}