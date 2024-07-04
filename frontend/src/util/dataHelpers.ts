import { Template } from "@pdfme/common";
import { getTemplate, makeTemplateInput } from "../templates/baseTemplate";
import { populateField } from "./helper";
import { SaltData, TemplateRequest, TemplateResponse } from "./types";
import { Designer } from "@pdfme/ui";

export const templateInputsFromSaltData = (saltData: SaltData[], selectedBootcampIndex: number, currentPageIndex: number) => {
    const inputs = 
        [makeTemplateInput(
          populateField(
            // @ts-ignore
            saltData[selectedBootcampIndex].diplomaTemplate.intro,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].students.length > 0 ? saltData[selectedBootcampIndex].students[currentPageIndex].name : "noname"
          ),
          populateField(
            // @ts-ignore
            saltData[selectedBootcampIndex].diplomaTemplate.main,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].students.length > 0 ? saltData[selectedBootcampIndex].students[currentPageIndex].name : "noname"
          ),
          populateField(
            // @ts-ignore
            saltData[selectedBootcampIndex].diplomaTemplate.footer,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].students.length > 0 ? saltData[selectedBootcampIndex].students[currentPageIndex].name : "noname"
          ),
          // @ts-ignore
          saltData[selectedBootcampIndex].diplomaTemplate.basePdf
        )];
    return inputs;
}

export const templateInputsFromBootcampData = (selectedBootcampData: SaltData, name: string) => {
  return makeTemplateInput(
    populateField(
      selectedBootcampData.diplomaTemplate.intro, 
      selectedBootcampData.classname, 
      selectedBootcampData.dategraduate, 
      name),
    populateField(
      selectedBootcampData.diplomaTemplate.main, 
      selectedBootcampData.classname, 
      selectedBootcampData.dategraduate, 
      name),
    populateField(
      selectedBootcampData.diplomaTemplate.footer, 
      selectedBootcampData.classname, 
      selectedBootcampData.dategraduate, 
      name),
    selectedBootcampData.diplomaTemplate.basePdf
  );
}

export const mapTemplateInputsToTemplateViewer = (saltData: SaltData[], selectedBootcampIndex: number, inputs: any) => {
    const template: Template = getTemplate(
        inputs,
        { 
          x: saltData[selectedBootcampIndex].diplomaTemplate.introStyling?.xPos ?? null, 
          y: saltData[selectedBootcampIndex].diplomaTemplate.introStyling?.yPos ?? null
        }, // headerPos
        { 
          width: saltData[selectedBootcampIndex].diplomaTemplate.introStyling?.width ?? null, 
          height: saltData[selectedBootcampIndex].diplomaTemplate.introStyling?.height ?? null
        }, // headerSize
        saltData[selectedBootcampIndex].diplomaTemplate.introStyling?.fontSize ?? null, // footerFontSize
        saltData[selectedBootcampIndex].diplomaTemplate.introStyling?.fontColor ?? null, // footerFontColor
        saltData[selectedBootcampIndex].diplomaTemplate.introStyling?.fontName ?? null, // footerFont
        saltData[selectedBootcampIndex].diplomaTemplate.introStyling?.alignment ?? null, // footerAlignment
        { 
          x: saltData[selectedBootcampIndex].diplomaTemplate.mainStyling?.xPos ?? null, 
          y: saltData[selectedBootcampIndex].diplomaTemplate.mainStyling?.yPos ?? null
        }, // mainPos
        { 
          width: saltData[selectedBootcampIndex].diplomaTemplate.mainStyling?.width ?? null, 
          height: saltData[selectedBootcampIndex].diplomaTemplate.mainStyling?.height ?? null
        }, // mainSize
        saltData[selectedBootcampIndex].diplomaTemplate.mainStyling?.fontSize ?? null, // footerFontSize
        saltData[selectedBootcampIndex].diplomaTemplate.mainStyling?.fontColor ?? null, // footerFontColor
        saltData[selectedBootcampIndex].diplomaTemplate.mainStyling?.fontName ?? null, // footerFont
        saltData[selectedBootcampIndex].diplomaTemplate.mainStyling?.alignment ?? null, // footerAlignment
        { 
          x: saltData[selectedBootcampIndex].diplomaTemplate.footerStyling?.xPos ?? null, 
          y: saltData[selectedBootcampIndex].diplomaTemplate.footerStyling?.yPos ?? null 
        }, // footerPos
        { 
          width: saltData[selectedBootcampIndex].diplomaTemplate.footerStyling?.width ?? null, 
          height: saltData[selectedBootcampIndex].diplomaTemplate.footerStyling?.height ?? null
        }, // footerSize
        saltData[selectedBootcampIndex].diplomaTemplate.footerStyling?.fontSize ?? null, // footerFontSize
        saltData[selectedBootcampIndex].diplomaTemplate.footerStyling?.fontColor ?? null, // footerFontColor
        saltData[selectedBootcampIndex].diplomaTemplate.footerStyling?.fontName ?? null, // footerFont
        saltData[selectedBootcampIndex].diplomaTemplate.footerStyling?.alignment ?? null // footerAlignment
      );
    return template;
}

export const mapTemplateInputsBootcampsToTemplateViewer = (bootcamp: any, pdfInput: any) => {
  const template: Template = getTemplate(
    pdfInput,
    {
        x: bootcamp.diplomaTemplate.introStyling?.xPos ?? null,
        y: bootcamp.diplomaTemplate.introStyling?.yPos ?? null,
    },
    {
        width: bootcamp.diplomaTemplate.introStyling?.width ?? null,
        height: bootcamp.diplomaTemplate.introStyling?.height ?? null,
    },
    bootcamp.diplomaTemplate.introStyling?.fontSize ?? null,
    bootcamp.diplomaTemplate.introStyling?.fontColor ?? null,
    bootcamp.diplomaTemplate.introStyling?.fontName ?? null,
    bootcamp.diplomaTemplate.introStyling?.alignment ?? null,
    {
        x: bootcamp.diplomaTemplate.mainStyling?.xPos ?? null,
        y: bootcamp.diplomaTemplate.mainStyling?.yPos ?? null,
    },
    {
        width: bootcamp.diplomaTemplate.mainStyling?.width ?? null,
        height: bootcamp.diplomaTemplate.mainStyling?.height ?? null,
    },
    bootcamp.diplomaTemplate.mainStyling?.fontSize ?? null,
    bootcamp.diplomaTemplate.mainStyling?.fontColor ?? null,
    bootcamp.diplomaTemplate.mainStyling?.fontName ?? null,
    bootcamp.diplomaTemplate.mainStyling?.alignment ?? null,
    {
        x: bootcamp.diplomaTemplate.footerStyling?.xPos ?? null,
        y: bootcamp.diplomaTemplate.footerStyling?.yPos ?? null,
    },
    {
        width: bootcamp.diplomaTemplate.footerStyling?.width ?? null,
        height: bootcamp.diplomaTemplate.footerStyling?.height ?? null,
    },
    bootcamp.diplomaTemplate.footerStyling?.fontSize ?? null,
    bootcamp.diplomaTemplate.footerStyling?.fontColor ?? null,
    bootcamp.diplomaTemplate.footerStyling?.fontName ?? null,
    bootcamp.diplomaTemplate.footerStyling?.alignment ?? null
);
  return template;
}

export const mapTemplateInputsToTemplateDesigner = (currentTemplate: any, inputs: any) => {
    const template: Template = getTemplate(
        inputs,
        {
            x: currentTemplate.introStyling.XPos ?? null,
            y: currentTemplate.introStyling.YPos ?? null,
        },
        {
            width: currentTemplate.introStyling.Width ?? null,
            height: currentTemplate.introStyling.Height ?? null,
        },
        currentTemplate.introStyling?.FontSize ?? null,
        currentTemplate.introStyling?.FontColor ?? null,
        currentTemplate.introStyling?.FontName ?? null,
        currentTemplate.introStyling?.Alignment ?? null,
        {
            x: currentTemplate.mainStyling.XPos ?? null,
            y: currentTemplate.mainStyling.YPos ?? null,
        },
        {
            width: currentTemplate.mainStyling.Width ?? null,
            height: currentTemplate.mainStyling.Height ?? null,
        },
        currentTemplate.mainStyling?.FontSize ?? null,
        currentTemplate.mainStyling?.FontColor ?? null,
        currentTemplate.mainStyling?.FontName ?? null,
        currentTemplate.mainStyling?.Alignment ?? null,
        {
            x: currentTemplate.footerStyling.XPos ?? null,
            y: currentTemplate.footerStyling.YPos ?? null,
        },
        {
            width: currentTemplate.footerStyling.Width ?? null,
            height: currentTemplate.footerStyling.Height ?? null,
        },
        currentTemplate.footerStyling?.FontSize ?? null,
        currentTemplate.footerStyling?.FontColor ?? null,
        currentTemplate.footerStyling?.FontName ?? null,
        currentTemplate.footerStyling?.Alignment ?? null
    );

    return template;
}

export const mapTemplatesToTemplateData = (templateInput: TemplateResponse[]) => {
    const templateData = templateInput.map(template => ({
        id: template.id,
        templateName: template.name,
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

export const createUpdatedTemplate = (currentTemplate: any, designer: any) => {
    const currentTemplateFields = designer.current.getTemplate();
    const updatedTemplate = {
        ...currentTemplate,
        intro: currentTemplateFields.sampledata[0].header,
        introStyling: {
            XPos: currentTemplateFields.schemas[0].header.position.x,
            YPos: currentTemplateFields.schemas[0].header.position.y,
        },
        main: currentTemplateFields.sampledata[0].main,
        mainStyling: {
            XPos: currentTemplateFields.schemas[0].main.position.x,
            YPos: currentTemplateFields.schemas[0].main.position.y
        },
        footer: currentTemplateFields.sampledata[0].footer,
        footerStyling: {
            XPos: currentTemplateFields.schemas[0].footer.position.x,
            YPos: currentTemplateFields.schemas[0].footer.position.y,
        },
    }
    return updatedTemplate;
}

export const createBlankTemplate = (templateName: string) => {
    const blankTemplate: TemplateRequest = {
        templateName: templateName,
        intro: "",
        main: "",
        footer: "",
        basePdf: "",
      }
    return blankTemplate;
}