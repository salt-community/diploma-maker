/*
    DiplomaService
    
    A collection of methods that helps creating, posting, emailing and displaying diplomas
*/

import { BackendService, PdfMeService, StringService, TemplateService } from '@/services';
import type { BootcampTypes, PdfMeTypes, TemplateTypes, BackendTypes } from '@/services';

export async function generatePdf(template: PdfMeTypes.Template, substitions: TemplateTypes.Substitions) {
    const inputs = TemplateService.substitutePlaceholdersWithContent(
        template,
        substitions,
    );

    const pdf = await PdfMeService.generate({
        template,
        plugins: PdfMeService.plugins,
        inputs,
    });

    return new Blob([pdf.buffer], { type: "application/pdf" });
}

export function createSubstitions(diploma: BackendTypes.DiplomaRecord) {
    return {
        studentName: diploma.studentName,
        track: diploma.track,
        graduationDate: StringService.formatDate_YYYY_mm_dd(diploma.graduationDate),
        qrLink: `${import.meta.env.VITE_VALIDATE_DIPLOMA_URL}/${diploma.guid ?? "previewDiploma"}}`
    } as TemplateTypes.Substitions;
}

function generateEmailHtml(diploma: BackendTypes.DiplomaRecord) {
    return (
        `
        <h1>${diploma.studentName}</h1>
        <p>Congratulations, you have completed the ${diploma.track} bootcamp at<p>
        <p>School of Applied Technology!</p>
        <p>Attached is your diploma. Now, let's start your career in tech!</p>
        `
    );
}

export async function emailDiploma(
    template: PdfMeTypes.Template,
    diploma: BackendTypes.DiplomaRecord,
    jwt: string) {

    const blob = await generatePdf(template, createSubstitions(diploma));

    const blobString = StringService.base64StringWithoutMetaData(
        await StringService.blobToBase64String(blob)
    );

    await BackendService.sendDiplomaEmail({
        messageHtml: generateEmailHtml(diploma),
        studentEmail: diploma.studentEmail,
        diplomaPdfBase64: blobString,
    }, jwt);
}

export async function postDiploma(
    template: BackendTypes.Template,
    bootcamp: BootcampTypes.Bootcamp,
    student: BootcampTypes.Student
) {
    if (!template.guid)
        throw new Error("Template lacks guid");

    const diploma: BackendTypes.DiplomaRecord = {
        studentName: student.name,
        studentEmail: student.email,
        track: bootcamp.track,
        graduationDate: bootcamp.graduationDate,
        templateGuid: template.guid
    };

    return await BackendService.postEntity<BackendTypes.DiplomaRecord>("DiplomaRecord", diploma);
}

export function historicDiplomaToTemplateAndSubstitutions(historicDiploma: BackendTypes.HistoricDiploma) {
    const template = JSON.parse(historicDiploma.templateJson) as PdfMeTypes.Template;

    const substitions = {
        studentName: historicDiploma.studentName,
        track: historicDiploma.track,
        graduationDate: StringService.formatDate_YYYY_mm_dd(historicDiploma.graduationDate),
        qrLink: "www.google.com"
    } as TemplateTypes.Substitions;

    return [template, substitions] as [PdfMeTypes.Template, TemplateTypes.Substitions];
}