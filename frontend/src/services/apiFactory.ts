import { BootcampRequest, EmailSendRequest, FormDataUpdateRequest, StudentUpdateRequestDto, TemplateRequest } from "../util/types";
import { deleteBootcampById, getBootcampById, getBootcamps, postBootcamp, updateBootcamp, UpdateBootcampWithNewFormdata } from "./bootcampService";
import { postEmail } from "./emailService";
import { getTemplatePdfFile } from "./fileService";
import { deleteStudentById, getStudentById, getStudentsByKeyword, updateSingleStudent } from "./studentService";
import { deleteTemplateById, getAllTemplates, getTemplateById, postTemplate, putTemplate } from "./templateService";

export const initApiEndpoints = (apiBaseUrl: string) => {
    return {
        // Template Endpoint
        getAllTemplates: (setLoadingMessage: (message: string) => void) => getAllTemplates(apiBaseUrl, setLoadingMessage),
        getTemplateById: (id: string) => getTemplateById(apiBaseUrl, id),
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

        // Student Endpoint
        getStudentById: (guidId: string) => getStudentById(apiBaseUrl, guidId),
        getStudentsByKeyword: (keyword: string) => getStudentsByKeyword(apiBaseUrl, keyword),
        deleteStudentById: (guidId: string) => deleteStudentById(apiBaseUrl, guidId),
        updateSingleStudent: (studentRequest: StudentUpdateRequestDto) => updateSingleStudent(apiBaseUrl, studentRequest),
        
        // Email Endpoint
        postEmail: (emailRequest: EmailSendRequest) => postEmail(apiBaseUrl, emailRequest),

        // File Endpoint
        getTemplatePdfFile: (url: string, lastUpdated: Date) => getTemplatePdfFile(apiBaseUrl, url, lastUpdated),
    };
};