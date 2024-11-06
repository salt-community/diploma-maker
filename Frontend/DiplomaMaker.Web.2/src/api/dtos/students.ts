export type StudentRequest = {
    guidId?: string;
    verificationCode: string;
    name: string;
    email?: string;
}

export type StudentResponse = {
    guid: string;
    verificationCode: string;
    name: string;
    email: string;
    previewImageUrl?: string,
    previewImageLQIPUrl?: string,
    lastGenerated?: Date;
}

export type StudentUpdateRequest = {
    name: string;
    email: string;
}