export namespace BackendTypes {
    type BaseEntity = {
        guid?: string
    }

    export type NamedEntity = BaseEntity & {
        name: string
    }

    export type Template = BaseEntity & {
        name: string,
        templateJson: string
    }

    export type DiplomaRecord = BaseEntity & {
        studentName: string,
        studentEmail: string
        track: string,
        graduationDate: Date,
        templateGuid: string,
    }

    export type HistoricDiploma = {
        guid: string,
        studentName: string,
        track: string,
        studentEmail: string,
        graduationDate: Date,
        templateJson: string,
    }

    export type TemplatePeek = NamedEntity;

    export type SendEmailRequest = {
        studenEmail: string,
        studentName: string,
        track: string,
        diplomaPdfBase64: string
    }

    export type ControllerName =
        'DiplomaRecord' |
        'Template';

    export type Dto =
        DiplomaRecord | Template;
}

