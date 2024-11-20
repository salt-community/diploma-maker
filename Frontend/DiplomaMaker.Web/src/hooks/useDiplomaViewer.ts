/*
    UseDiplomaVerification
*/

import { Viewer } from "@pdfme/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Endpoints } from "../api";
import { PdfMe, PdfMeTypes, TemplateService } from "../services";

export default function useDiplomaViewer(
    guid: string,
    viewerDiv: React.MutableRefObject<HTMLDivElement | null>,
) {
    const viewer = useRef<PdfMeTypes.Viewer | null>(null);

    const getDiplomaWithContentQuery = useQuery({
        queryKey: ["DiplomaWithContent"],
        queryFn: async () => Endpoints.getDiplomaWithContentByGuid(guid),
    });

    useEffect(() => {
        const diplomaWithContent = getDiplomaWithContentQuery.data;

        if (!diplomaWithContent) return;

        if (viewer.current) return;

        const template = JSON.parse(
            diplomaWithContent.templateJson,
        ) as PdfMeTypes.Template;

        const substitions: Record<string, string> = {
            text: {
                "{studentName}": diplomaWithContent.studentName,
                "{graduationDate}": "Some date",
                "{track}": diplomaWithContent.track,
                "{diplomaGuid}": diplomaWithContent.guid,
                "{qrLink}": `${import.meta.env.VITE_FRONTEND_BASE_URL}/verication?diplomaGuid=${diplomaWithContent.diplomaGuid}`,
            },
            images: {},
            qrCodes: {},
            basePdf: diplomaWithContent.basePdf,
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
