// /*
//     UseDiplomaVerification
// */

// import { useQuery } from "@tanstack/react-query";
// import { Endpoints } from "../api";
// import { PdfMe, PdfMeTypes, TemplateService } from "../services";
// import { TemplateSubstitutions } from "../types/types";

// export default function useGeneratePdfFromFullDiploma(guid: string) {
//     const getFullDiplomaQuery = useQuery({
//         queryKey: ["FullDiploma"],
//         queryFn: async () => Endpoints.getFullDiplomaByGuid(guid),
//     });

//     const pdfLinkQuery = useQuery({
//         queryKey: ["PdfLink"],
//         queryFn: async () => await generatePdf() ?? ""
//     });

//     async function generatePdf() {
//         const fullDiploma = getFullDiplomaQuery.data;

//         if (!fullDiploma)
//             return;

//         const template = JSON.parse(fullDiploma.templateJson) as PdfMeTypes.Template;

//         const substitions: TemplateSubstitutions = {
//             text: {
//                 "{studentName}": fullDiploma.studentName,
//                 "{graduationDate}": "Some date",
//                 "{track}": fullDiploma.trackName,
//                 "{diplomaGuid}": fullDiploma.diplomaGuid,
//                 "{qrLink}": `${import.meta.env.VITE_FRONTEND_BASE_URL}/verication?diplomaGuid=${fullDiploma.diplomaGuid}`
//             },
//             images: {},
//             qrCodes: {},
//             basePdf: fullDiploma.basePdf
//         };

//         const inputs = TemplateService.substitutePlaceholdersWithContent(template, substitions);

//         const plugins = {
//             Text: PdfMe.text,
//             QR: PdfMe.barcodes.qrcode,
//             Image: PdfMe.image,
//         };

//         console.log("template");
//         console.log(template);
//         console.log("inputs");
//         console.log(inputs);

//         const pdf = await PdfMe.generate({
//             template,
//             plugins,
//             inputs
//         });

//         const blob = new Blob([pdf.buffer], { type: "application/pdf" });

//         return URL.createObjectURL(blob);
//     }

//     return {
//         pdfLink: pdfLinkQuery.data
//     }
// }
