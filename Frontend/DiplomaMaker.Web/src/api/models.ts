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
    studentName: string,
    studentEmail: string
    track: string,
    graduationDate: Date,
    templateJson: string,
}

export type DiplomaWithContent = {
    studentName: string,
    track: string,
    studentEmail: string,
    graduationDate: Date,
    templateJson: string,
}

export type TemplatePeek = NamedEntity;