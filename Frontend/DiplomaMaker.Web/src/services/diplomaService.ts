/*
    DiplomaService
    
    A collection of methods that helps creating, posting, emailing and displaying diplomas
*/

import type {
  BackendTypes,
  BootcampTypes,
  PdfMeTypes,
  TemplateTypes,
} from "@/services";
import {
  BackendService,
  PdfMeService,
  StringService,
  TemplateService,
} from "@/services";

export async function generatePdf(
  template: PdfMeTypes.Template,
  substitions: TemplateTypes.Substitions,
  fonts: PdfMeTypes.Font,
) {
  const inputs = TemplateService.substitutePlaceholdersWithContent(
    template,
    substitions,
  );

  const pdf = await PdfMeService.generate({
    options: {
      font: fonts,
    },
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
    qrLink: `${import.meta.env.VITE_VALIDATE_DIPLOMA_URL}/${diploma.guid ?? "previewDiploma"}}`,
  } as TemplateTypes.Substitions;
}

function generateEmailHtml(diploma: BackendTypes.DiplomaRecord) {
  return `
        <h1>${diploma.studentName}</h1>
        <p>Congratulations, you have completed the ${diploma.track} bootcamp at<p>
        <p>School of Applied Technology!</p>
        <p>Attached is your diploma. Now, let's start your career in tech!</p>
        `;
}

export async function emailDiploma(
  template: PdfMeTypes.Template,
  diploma: BackendTypes.DiplomaRecord,
  jwt: string,
  pdfMeFonts: PdfMeTypes.Font,
) {
  const blob = await generatePdf(
    template,
    createSubstitions(diploma),
    pdfMeFonts,
  );

  const blobString = StringService.base64StringWithoutMetaData(
    await StringService.blobToBase64String(blob),
  );

  await BackendService.sendDiplomaEmail(
    {
      messageHtml: generateEmailHtml(diploma),
      studentEmail: diploma.studentEmail,
      diplomaPdfBase64: blobString,
    },
    jwt,
  );
}

export async function postDiploma(
  template: BackendTypes.Template,
  bootcamp: BootcampTypes.Bootcamp,
  student: BootcampTypes.Student,
) {
  if (!template.guid) throw new Error("Template lacks guid");

  const diploma: BackendTypes.DiplomaRecord = {
    studentName: student.name,
    studentEmail: student.email,
    track: bootcamp.track,
    graduationDate: bootcamp.graduationDate,
    templateGuid: template.guid,
  };

  return await BackendService.postEntity<BackendTypes.DiplomaRecord>(
    "DiplomaRecord",
    diploma,
  );
}

export function historicDiplomaToTemplateAndSubstitutions(
  historicDiploma: BackendTypes.HistoricDiploma,
) {
  const template = JSON.parse(
    historicDiploma.templateJson,
  ) as PdfMeTypes.Template;

  const substitions = {
    studentName: historicDiploma.studentName,
    track: historicDiploma.track,
    graduationDate: StringService.formatDate_YYYY_mm_dd(
      historicDiploma.graduationDate,
    ),
    qrLink: `${import.meta.env.VITE_VALIDATE_DIPLOMA_URL}/${historicDiploma.guid}`,
  } as TemplateTypes.Substitions;

  return [template, substitions] as [
    PdfMeTypes.Template,
    TemplateTypes.Substitions,
  ];
}

/*
    Sort diplomas by date and group them by day
    Then sort each group by studentName
*/
export function groupDiplomas(diplomas: BackendTypes.DiplomaRecord[]) {
  const diplomaGroups: BackendTypes.DiplomaRecord[][] = [];

  diplomas.sort(
    (a, b) =>
      new Date(b.graduationDate).getTime() -
      new Date(a.graduationDate).getTime(),
  );

  let date = new Date();
  let groupIndex = -1;

  diplomas.forEach((diploma) => {
    if (diploma.graduationDate != date) {
      date = diploma.graduationDate;

      if (groupIndex >= 0)
        diplomaGroups[groupIndex].sort((a, b) =>
          ("" + a.studentName).localeCompare(b.studentName),
        );

      diplomaGroups.push([]);
      groupIndex++;
    }

    diplomaGroups[groupIndex].push(diploma);
  });

  return diplomaGroups;
}
