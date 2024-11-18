type BaseEntity = {
    guid?: string
}

export type NamedEntity = BaseEntity & {
    name: string
};

export type Template = BaseEntity & {
    templateJson: string
}

export type Diploma = BaseEntity & {
    studentGuid: string,
    bootcampGuid: string,
    templateGuid: string
}

export type DiplomaWithContent = {
    studentName: string,
    track: string,
    studentEmail: string,
    graduationDate: Date,
    templateJson: string,
}