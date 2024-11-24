/*
    DiplomaService
    
    A collection of methods that helps creating, posting, emailing and displaying diplomas
*/

import { BackendService, PdfMeService, StringService, TemplateService } from '@/services';
import type { BootcampTypes, PdfMeTypes, TemplateTypes, BackendTypes } from '@/services';

//Types
export namespace DiplomaTypes {
}

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

export function createSubstitions(
    bootcamp: BootcampTypes.Bootcamp,
    student: BootcampTypes.Student) {
    return {
        studentName: student.name,
        track: bootcamp.track,
        graduationDate: StringService.formatDate_YYYY_mm_dd(bootcamp.graduationDate),
        qrLink: "www.google.com"
    } as TemplateTypes.Substitions;
}

function generateEmailHTML(studentName: string, track: string) {
    return (
        `
        <h1>${studentName}</h1>
        <p>Congratulations, you have completed the ${track} bootcamp at<p>
        <p>School of Applied Technology!</p>
        <p>Attached is your diploma. Now, let's start your career in tech!</p>
        `
    );
}

export async function emailDiploma(
    template: PdfMeTypes.Template,
    bootcamp: BootcampTypes.Bootcamp,
    student: BootcampTypes.Student,
    jwt: string) {

    const blob = await generatePdf(template, createSubstitions(bootcamp, student));

    const blobString = StringService.base64StringWithoutMetaData(
        await StringService.blobToBase64String(blob)
    );

    await BackendService.sendDiplomaEmail({
        messageHtml: generateEmailHTML(student.name, bootcamp.track),
        studentEmail: student.email,
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

    await BackendService.postEntity<BackendTypes.DiplomaRecord>("DiplomaRecord", diploma);
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