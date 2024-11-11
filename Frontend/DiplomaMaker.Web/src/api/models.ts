type BaseEntity = {
    guid: string
}

export type Track = BaseEntity & {
    name: string
}

export type Student = BaseEntity & {
    name: string
    enail: string
}

export type StringFile = BaseEntity & {
    name: string,
    mimeType: string,
    content: string
}

export type Template = BaseEntity & {
    basePdfGuid?: string
}

export type Bootcamp = BaseEntity & {
    graduationDate: Date,
    students: Student[],
    track: Track[]
}

export type Diploma = BaseEntity & {
    students: Student,
    bootcamp: Bootcamp,
    template: Template
}

