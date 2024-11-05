export type StudentRequest = {
    guidId?: string;
    name: string;
    email?: string;
    verificationCode: string;

}
export type StudentResponse = {
    guidId: string;
    name: string;
    email: string;
    verificationCode: string;
    lastGenerated?: Date;
    previewImageUrl?: string | null,
    previewImageLQIPUrl?: string | null
}
export type StudentUpdateRequest = {
    guidId: string;
    studentName: string;
    emailAddress: string;
}

export type Student = {
    guidId?: string;
    name: string;
    email: string;
    verificationCode?: string;
    lastGenerated?: Date;
    previewImageUrl?: string | null,
    previewImageLQIPUrl?: string | null
}