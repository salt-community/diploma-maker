import { Template } from "@pdfme/common";
import { getTemplate, makeTemplateInput } from "../templates/baseTemplate";
import { populateField } from "./helper";
import { SaltData, TemplateResponse } from "./types";

export const templateInputsFromSaltData = (saltData: SaltData[], selectedBootcampIndex: number, currentPageIndex: number) => {
    const inputs = 
        [makeTemplateInput(
          populateField(
            // @ts-ignore
            saltData[selectedBootcampIndex].template.intro,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].names[currentPageIndex]
          ),
          populateField(
            // @ts-ignore
            saltData[selectedBootcampIndex].template.main,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].names[currentPageIndex]
          ),
          populateField(
            // @ts-ignore
            saltData[selectedBootcampIndex].template.footer,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].names[currentPageIndex]
          ),
          // @ts-ignore
          saltData[selectedBootcampIndex].template.basePdf
        )];
    return inputs;
}

export const mapTemplateInputsToTemplateViewer = (saltData: SaltData[], selectedBootcampIndex: number, inputs: any) => {
    const template: Template = getTemplate(
        inputs[0],
        { 
          x: saltData[selectedBootcampIndex].template.introStyling?.xPos ?? null, 
          y: saltData[selectedBootcampIndex].template.introStyling?.yPos ?? null
        }, // headerPos
        { 
          width: saltData[selectedBootcampIndex].template.introStyling?.width ?? null, 
          height: saltData[selectedBootcampIndex].template.introStyling?.height ?? null
        }, // headerSize
        saltData[selectedBootcampIndex].template.introStyling?.fontSize ?? null, // footerFontSize
        saltData[selectedBootcampIndex].template.introStyling?.fontColor ?? null, // footerFontColor
        saltData[selectedBootcampIndex].template.introStyling?.fontName ?? null, // footerFont
        saltData[selectedBootcampIndex].template.introStyling?.alignment ?? null, // footerAlignment
        { 
          x: saltData[selectedBootcampIndex].template.mainStyling?.xPos ?? null, 
          y: saltData[selectedBootcampIndex].template.mainStyling?.yPos ?? null
        }, // mainPos
        { 
          width: saltData[selectedBootcampIndex].template.mainStyling?.width ?? null, 
          height: saltData[selectedBootcampIndex].template.mainStyling?.height ?? null
        }, // mainSize
        saltData[selectedBootcampIndex].template.mainStyling?.fontSize ?? null, // footerFontSize
        saltData[selectedBootcampIndex].template.mainStyling?.fontColor ?? null, // footerFontColor
        saltData[selectedBootcampIndex].template.mainStyling?.fontName ?? null, // footerFont
        saltData[selectedBootcampIndex].template.mainStyling?.alignment ?? null, // footerAlignment
        { 
          x: saltData[selectedBootcampIndex].template.footerStyling?.xPos ?? null, 
          y: saltData[selectedBootcampIndex].template.footerStyling?.yPos ?? null 
        }, // footerPos
        { 
          width: saltData[selectedBootcampIndex].template.footerStyling?.width ?? null, 
          height: saltData[selectedBootcampIndex].template.footerStyling?.height ?? null
        }, // footerSize
        saltData[selectedBootcampIndex].template.footerStyling?.fontSize ?? null, // footerFontSize
        saltData[selectedBootcampIndex].template.footerStyling?.fontColor ?? null, // footerFontColor
        saltData[selectedBootcampIndex].template.footerStyling?.fontName ?? null, // footerFont
        saltData[selectedBootcampIndex].template.footerStyling?.alignment ?? null // footerAlignment
      );
    return template;
}

export const mapTemplatesToTemplateDataDesigner = (templateInput: TemplateResponse[]) => {
    const templateData = templateInput.map(template => ({
        id: template.id,
        templateName: template.templateName,
        footer: template.footer,
        footerStyling: {
            XPos: template.footerStyling?.xPos,
            YPos: template.footerStyling?.yPos,
            Width: template.footerStyling?.width,
            Height: template.footerStyling?.height,
            FontSize: template.footerStyling?.fontSize,
            FontColor: template.footerStyling?.fontColor,
            FontName: template.footerStyling?.fontName,
            Alignment: template.footerStyling?.alignment
        },
        intro: template.intro,
        introStyling: {
            XPos: template.introStyling?.xPos,
            YPos: template.introStyling?.yPos,
            Width: template.introStyling?.width,
            Height: template.introStyling?.height,
            FontSize: template.introStyling?.fontSize,
            FontColor: template.introStyling?.fontColor,
            FontName: template.introStyling?.fontName,
            Alignment: template.introStyling?.alignment
        },
        main: template.main,
        mainStyling: {
            XPos: template.mainStyling?.xPos,
            YPos: template.mainStyling?.yPos,
            Width: template.mainStyling?.width,
            Height: template.mainStyling?.height,
            FontSize: template.mainStyling?.fontSize,
            FontColor: template.mainStyling?.fontColor,
            FontName: template.mainStyling?.fontName,
            Alignment: template.mainStyling?.alignment
        },
        basePdf: template.basePdf
    }));

    return templateData
}