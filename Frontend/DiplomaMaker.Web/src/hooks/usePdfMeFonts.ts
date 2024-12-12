import { PdfMeService, PdfMeTypes } from "@/services";
import { useEffect, useState } from "react";
import { useFonts } from "./useFonts";

const DEFAULT_PDF_ME_FONT = {
  fallback: true,
  label: PdfMeService.DEFAULT_FONT_NAME,
  data: PdfMeService.getDefaultFont()[PdfMeService.DEFAULT_FONT_NAME].data,
};

export function usePdfMeFonts() {
  const { data: fonts } = useFonts();

  const [pdfMeFonts, setPdfMeFonts] = useState<PdfMeTypes.Font>({
    [DEFAULT_PDF_ME_FONT.label]: DEFAULT_PDF_ME_FONT,
  });

  useEffect(() => {
    if (fonts) {
      const fontEntries = fonts.flatMap((font) =>
        Object.entries(font.files).map(([key, value]) => ({
          fallback: false,
          label: `${font.family}-${key}`,
          data: value,
        })),
      );

      const updatedFonts = {
        ...fontEntries.reduce(
          (acc, font) => ({ ...acc, [font.label]: font }),
          {},
        ),
        [DEFAULT_PDF_ME_FONT.label]: DEFAULT_PDF_ME_FONT,
      };

      setPdfMeFonts(updatedFonts);
    }
  }, [fonts]);

  return pdfMeFonts;
}
