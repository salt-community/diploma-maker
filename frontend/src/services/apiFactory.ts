import { BootcampRequest, EmailSendRequest, FormDataUpdateRequest, MakeActiveSnapshotRequestDto, studentImagePreview, StudentUpdateRequestDto, TemplateRequest } from "../util/types";
import { deleteBootcampById, getBootcampById, getBootcamps, postBootcamp, updateBootcamp, UpdateBootcampWithNewFormdata, updateBundledStudentsPreviewImages, updateStudentPreviewImage } from "./bootcampService";
import { postEmail } from "./emailService";
import { getTemplatePdfFile } from "./fileService";
import { getHistoryByVerificationCode, getHistorySnapshots, makeActiveHistorySnapShot } from "./historySnapShotService";
import { deleteStudentById, getStudentById, getStudentByVerificationCode, getStudentsByKeyword, updateSingleStudent } from "./studentService";
import { deleteTemplateById, getAllTemplates, getTemplateById, postTemplate, putTemplate } from "./templateService";
import { getAllTracks } from "./trackService";
import { getUserFonts } from "./userFontService";

export const initApiEndpoints = (apiBaseUrl: string) => {
    return {
        // Template Endpoint
        getAllTemplates: (setLoadingMessage: (message: string) => void) => getAllTemplates(apiBaseUrl, setLoadingMessage),
        getTemplateById: (id: string, setLoadingMessage: (message: string) => void) => getTemplateById(apiBaseUrl, id, setLoadingMessage),
        postTemplate: (templateRequest: TemplateRequest) => postTemplate(apiBaseUrl, templateRequest),
        deleteTemplateById: (id: number) => deleteTemplateById(apiBaseUrl, id),
        putTemplate: (id: number, templateRequest: TemplateRequest) => putTemplate(apiBaseUrl, id, templateRequest),

        // Bootcamp Endpoint
        postBootcamp: (bootcampRequest: BootcampRequest) => postBootcamp(apiBaseUrl, bootcampRequest),
        getBootcamps: (setLoadingMessage: (message: string) => void) => getBootcamps(apiBaseUrl, setLoadingMessage),
        getBootcampById: (guidId: string) => getBootcampById(apiBaseUrl, guidId),
        updateBootcamp: (bootcampRequest: BootcampRequest) => updateBootcamp(apiBaseUrl, bootcampRequest),
        deleteBootcampById: (guidId: string) => deleteBootcampById(apiBaseUrl, guidId),
        UpdateBootcampWithNewFormdata: (formDataUpdateRequest: FormDataUpdateRequest, guidId: string) => UpdateBootcampWithNewFormdata(apiBaseUrl, formDataUpdateRequest, guidId),
        updateStudentPreviewImage: (studentImagePreviewRequest: studentImagePreview) => updateStudentPreviewImage(apiBaseUrl, studentImagePreviewRequest),
        updateBundledStudentsPreviewImages: (studentImagePreviewRequests: studentImagePreview[]) => updateBundledStudentsPreviewImages(apiBaseUrl, studentImagePreviewRequests),

        // Student Endpoint
        getStudentById: (guidId: string) => getStudentById(apiBaseUrl, guidId),
        getStudentByVerificationCode: (verificationCode: string) => getStudentByVerificationCode(apiBaseUrl, verificationCode),
        getStudentsByKeyword: (keyword: string) => getStudentsByKeyword(apiBaseUrl, keyword),
        deleteStudentById: (guidId: string) => deleteStudentById(apiBaseUrl, guidId),
        updateSingleStudent: (studentRequest: StudentUpdateRequestDto) => updateSingleStudent(apiBaseUrl, studentRequest),
        
        // Email Endpoint
        postEmail: (emailRequest: EmailSendRequest) => postEmail(apiBaseUrl, emailRequest),

        // File Endpoint
        getTemplatePdfFile: (url: string, lastUpdated: Date, setLoadingMessage: (message: string) => void) => getTemplatePdfFile(apiBaseUrl, url, lastUpdated, setLoadingMessage),
    
        // Track Endpoint
        getAllTracks:(setLoadingMessage: (message: string) => void) => getAllTracks(apiBaseUrl, setLoadingMessage),

        // HistorySnapshot Endpoint
        getHistorySnapshots: (setLoadingMessage: (message: string) => void) => getHistorySnapshots(apiBaseUrl, setLoadingMessage),
        getHistoryByVerificationCode: (verificationCode: string) => getHistoryByVerificationCode(apiBaseUrl, verificationCode),
        makeActiveHistorySnapShot: (snapshotUpdateRequest: MakeActiveSnapshotRequestDto) => makeActiveHistorySnapShot(apiBaseUrl, snapshotUpdateRequest),

        // User Font Endpoint
        getUserFonts: () => getUserFonts(apiBaseUrl),
    };
};