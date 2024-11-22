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

export async function emailDiploma(
    template: PdfMeTypes.Template,
    bootcamp: BootcampTypes.Bootcamp,
    student: BootcampTypes.Student) {

    const blob = await generatePdf(template, createSubstitions(bootcamp, student));

    const blobString = StringService.base64StringWithoutMetaData(
        await StringService.blobToBase64String(blob)
    );

    await BackendService.sendDiplomaEmail({
        track: bootcamp.track,
        diplomaPdfBase64: blobString,
        studenEmail: bootcamp.students[0].email,
        studentName: bootcamp.students[0].name
    });
}

export async function postDiploma(
    template: BackendTypes.Template,
    bootcamp: BootcampTypes.Bootcamp,
    student: BootcampTypes.Student
) {
    if (!template.guid)
        throw new Error("Template lacks guid");

    const diploma: BackendTypes.Diploma = {
        studentName: student.name,
        studentEmail: student.email,
        track: bootcamp.track,
        graduationDate: bootcamp.graduationDate,
        templateGuid: template.guid
    };

    await BackendService.postEntity<BackendTypes.Diploma>("Diploma", diploma);
}