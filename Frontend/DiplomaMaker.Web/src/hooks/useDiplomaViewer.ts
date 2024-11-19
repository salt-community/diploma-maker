/*
    UseDiplomaVerification
*/

import { useQuery } from "@tanstack/react-query";
import { Endpoints } from "../api";
import { PdfMe, PdfMeTypes, TemplateService } from "../services";
import { TemplateSubstitutions } from "../types/types";
import { pdfjs } from "react-pdf";
import { Viewer } from "@pdfme/ui";
import { useEffect, useRef } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function useDiplomaViewer(
  guid: string,
  viewerDiv: React.MutableRefObject<HTMLDivElement | null>,
) {
  const viewer = useRef<PdfMeTypes.Viewer | null>(null);

  const getFullDiplomaQuery = useQuery({
    queryKey: ["FullDiploma"],
    queryFn: async () => Endpoints.getFullDiplomaByGuid(guid),
  });

  useEffect(() => {
    const fullDiploma = getFullDiplomaQuery.data;

    if (!fullDiploma) return;

    if (viewer.current) return;

    const template = JSON.parse(
      fullDiploma.templateJson,
    ) as PdfMeTypes.Template;

    const substitions: TemplateSubstitutions = {
      text: {
        "{studentName}": fullDiploma.studentName,
        "{graduationDate}": "Some date",
        "{track}": fullDiploma.trackName,
        "{diplomaGuid}": fullDiploma.diplomaGuid,
        "{qrLink}": `${import.meta.env.VITE_FRONTEND_BASE_URL}/verication?diplomaGuid=${fullDiploma.diplomaGuid}`,
      },
      images: {},
      qrCodes: {},
      basePdf: fullDiploma.basePdf,
    };

    const inputs = TemplateService.substitutePlaceholdersWithContent(
      template,
      substitions,
    );

    const plugins = {
      Text: PdfMe.text,
      QR: PdfMe.barcodes.qrcode,
      Image: PdfMe.image,
    };

    viewer.current = new Viewer({
      domContainer: viewerDiv.current!,
      inputs,
      template,
      //TODO: add fonts here
      plugins,
    });
  });
}