import { Size, Template } from "@pdfme/common";
import { XYPosition } from "../util/types";

export const makeTemplateInput= (header: string, main: string, footer: string, pdfbase: string) => {
  return {
    main,
    header,
    footer,
    pdfbase,
  };
};

export const getTemplate = (
  input: { 
    header: string; main: string; footer: string; pdfbase: string }, 
    headerPos?: XYPosition, headerSize?: Size, headerFontSize?: number, headerFontColor?: string, headerFont?: string, headerAlignment?: string,
    mainPos?: XYPosition, mainSize?: Size, mainFontSize?: number, mainFontColor?: string, mainFont?: string, mainAlignment?: string,
    footerPos?: XYPosition, footerSize?: Size, footerFontSize?: number, footerFontColor?: string, footerFont?: string, footerAlignment?: string
  ): Template => ({

schemas: [
  {
    footer: {
      type: "text",
      position: footerPos ?? { x: 35.08, y: 135.72 },
      width: footerSize?.width ?? 145.76,
      height: footerSize?.height ?? 21.08,
      rotate: 0,
      fontSize: footerFontSize ?? 16,
      fontColor: footerFontColor ?? "#ffffff",
      fontmain: footerFont ?? "NotoSerifJP-Regular",
      alignment: footerAlignment ?? "center",
    },
    header: {
      type: "text",
      position: headerPos ?? { x: 83.89, y: 98.63 },
      width: headerSize?.width ?? 48.13,
      height: headerSize?.height ?? 10.23,
      rotate: 0,
      fontSize: headerFontSize ?? 16,
      fontColor: headerFontColor ?? "#ffffff",
      fontmain: headerFont ?? "NotoSerifJP-Regular",
      alignment: headerAlignment ?? "center",
    },
    main: {
      type: "text",
      position: mainPos ?? { x: 35.08, y: 113.4 },
      width: mainSize?.width ?? 145.76,
      height: mainSize?.height ?? 16.83,
      rotate: 0,
      fontSize: mainFontSize ?? 33,
      fontColor: mainFontColor ?? "#ffffff",
      fontmain: mainFont ?? "NotoSerifJP-Regular",
      alignment: mainAlignment ?? "center",
    },
  },
],
basePdf: input.pdfbase,
sampledata: [
  {
    footer: input.footer,
    header: input.header,
    main: input.main,
  }
],
columns: ["footer", "header", "main"],
});
