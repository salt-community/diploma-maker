import {apiEndpointParameters, BootcampRequest, EmailSendRequest, FormDataUpdateRequest, MakeActiveSnapshotRequestDto, studentImagePreview, StudentUpdateRequestDto, TemplateRequest, UserFontRequestDto } from "../util/types";
import { deleteBootcampById, getBootcampById, getBootcamps, postBootcamp, updateBootcamp, UpdateBootcampWithNewFormdata, updateBundledStudentsPreviewImages, updateStudentPreviewImage } from "./bootcampService";
import { postEmail } from "./emailService";
import { getTemplatePdfFile } from "./fileService";
import { getHistoryByVerificationCode, getHistorySnapshots, makeActiveHistorySnapShot } from "./historySnapShotService";
import { deleteStudentById, getStudentById, getStudentByVerificationCode, getStudentsByKeyword, updateSingleStudent } from "./studentService";
import { deleteTemplateById, getAllTemplates, getTemplateById, postTemplate, putTemplate } from "./templateService";
import { getAllTracks } from "./trackService";
import { getUserFonts, postUserFonts } from "./UserFontService";

export const initApiEndpoints = (apiParameters: apiEndpointParameters) => {
    return {
        // Template Endpoint
        getAllTemplates: (setLoadingMessage: (message: string) => void) => getAllTemplates(apiParameters, setLoadingMessage),
        getTemplateById: (id: string, setLoadingMessage: (message: string) => void) => getTemplateById(apiParameters, id, setLoadingMessage),
        postTemplate: (templateRequest: TemplateRequest) => postTemplate(apiParameters, templateRequest),
        deleteTemplateById: (id: number) => deleteTemplateById(apiParameters, id),
        putTemplate: (id: number, templateRequest: TemplateRequest) => putTemplate(apiParameters, id, templateRequest),

        // Bootcamp Endpoint
        postBootcamp: (bootcampRequest: BootcampRequest) => postBootcamp(apiParameters, bootcampRequest),
        getBootcamps: (setLoadingMessage: (message: string) => void) => getBootcamps(apiParameters, setLoadingMessage),
        getBootcampById: (guidId: string) => getBootcampById(apiParameters, guidId),
        updateBootcamp: (bootcampRequest: BootcampRequest) => updateBootcamp(apiParameters, bootcampRequest),
        deleteBootcampById: (guidId: string) => deleteBootcampById(apiParameters, guidId),
        UpdateBootcampWithNewFormdata: (formDataUpdateRequest: FormDataUpdateRequest, guidId: string) => UpdateBootcampWithNewFormdata(apiParameters, formDataUpdateRequest, guidId),
        updateStudentPreviewImage: (studentImagePreviewRequest: studentImagePreview) => updateStudentPreviewImage(apiParameters, studentImagePreviewRequest),
        updateBundledStudentsPreviewImages: (studentImagePreviewRequests: studentImagePreview[]) => updateBundledStudentsPreviewImages(apiParameters, studentImagePreviewRequests),

        // Student Endpoint
        getStudentById: (guidId: string) => getStudentById(apiParameters, guidId),
        getStudentByVerificationCode: (verificationCode: string) => getStudentByVerificationCode(apiParameters, verificationCode),
        getStudentsByKeyword: (keyword: string) => getStudentsByKeyword(apiParameters, keyword),
        deleteStudentById: (guidId: string) => deleteStudentById(apiParameters, guidId),
        updateSingleStudent: (studentRequest: StudentUpdateRequestDto) => updateSingleStudent(apiParameters, studentRequest),
        
        // Email Endpoint
        postEmail: (emailRequest: EmailSendRequest) => postEmail(apiParameters, emailRequest),

        // File Endpoint
        getTemplatePdfFile: (url: string, lastUpdated: Date, setLoadingMessage: (message: string) => void) => getTemplatePdfFile(apiParameters, url, lastUpdated, setLoadingMessage),
    
        // Track Endpoint
        getAllTracks:(setLoadingMessage: (message: string) => void) => getAllTracks(apiParameters, setLoadingMessage),

        // HistorySnapshot Endpoint
        getHistorySnapshots: (setLoadingMessage: (message: string) => void) => getHistorySnapshots(apiParameters, setLoadingMessage),
        getHistoryByVerificationCode: (verificationCode: string) => getHistoryByVerificationCode(apiParameters, verificationCode),
        makeActiveHistorySnapShot: (snapshotUpdateRequest: MakeActiveSnapshotRequestDto) => makeActiveHistorySnapShot(apiParameters, snapshotUpdateRequest),

        // User Font Endpoint
        getUserFonts: () => getUserFonts(apiParameters.endpointUrl),
        postUserFonts: (userFonts: UserFontRequestDto[]) => postUserFonts(apiParameters.endpointUrl, userFonts),

    };
};