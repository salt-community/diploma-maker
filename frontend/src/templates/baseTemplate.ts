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

const checkPosition = (pos?: XYPosition): XYPosition | undefined => {
  return (pos?.x !== null && pos?.y !== null) ? pos : undefined;
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
      position: checkPosition(footerPos) ?? { x: 35.08, y: 135.72 },
      width: footerSize?.width !== null ? footerSize!.width : 145.76,
      height: footerSize?.height !== null ? footerSize!.height : 21.08,
      rotate: 0,
      fontSize: footerFontSize !== null ? footerFontSize : 16,
      fontColor: footerFontColor !== null ? footerFontColor : "#ffffff",
      fontmain: footerFont !== null ? footerFont : "NotoSerifJP-Regular",
      alignment: footerAlignment !== null ? footerAlignment : "center",
    },
    header: {
      type: "text",
      position: checkPosition(headerPos) ?? { x: 83.89, y: 98.63 },
      width: headerSize?.width !== null ? headerSize!.width : 48.13,
      height: headerSize?.height !== null ? headerSize!.height : 10.23,
      rotate: 0,
      fontSize: headerFontSize !== null ? headerFontSize : 16,
      fontColor: headerFontColor !== null ? headerFontColor : "#ffffff",
      fontmain: headerFont !== null ? headerFont : "NotoSerifJP-Regular",
      alignment: headerAlignment !== null ? headerAlignment : "center",
    },
    main: {
      type: "text",
      position: checkPosition(mainPos) ?? { x: 35.08, y: 113.4 },
      width: mainSize?.width !== null ? mainSize!.width : 145.76,
      height: mainSize?.height !== null ? mainSize!.height : 16.83,
      rotate: 0,
      fontSize: mainFontSize !== null ? mainFontSize : 33,
      fontColor: mainFontColor !== null ? mainFontColor : "#ffffff",
      fontmain: mainFont !== null ? mainFont : "NotoSerifJP-Regular",
      alignment: mainAlignment !== null ? mainAlignment : "center",
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