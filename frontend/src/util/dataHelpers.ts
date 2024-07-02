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
            saltData[selectedBootcampIndex].template.intro,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].students[currentPageIndex].name
          ),
          populateField(
            // @ts-ignore
            saltData[selectedBootcampIndex].template.main,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].students[currentPageIndex].name
          ),
          populateField(
            // @ts-ignore
            saltData[selectedBootcampIndex].template.footer,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].students[currentPageIndex].name
          ),
          // @ts-ignore
          saltData[selectedBootcampIndex].template.basePdf
        )];
    return inputs;
}

export const templateInputsFromBootcampData = (selectedBootcampData: any, name: string) => {
  return makeTemplateInput(
    populateField(
      selectedBootcampData.template.intro, 
      selectedBootcampData.classname, 
      selectedBootcampData.dategraduate, 
      name),
    populateField(
      selectedBootcampData.template.main, 
      selectedBootcampData.classname, 
      selectedBootcampData.dategraduate, 
      name),
    populateField(
      selectedBootcampData.template.footer, 
      selectedBootcampData.classname, 
      selectedBootcampData.dategraduate, 
      name),
    selectedBootcampData.template.basePdf
  );
}

export const mapTemplateInputsToTemplateViewer = (saltData: SaltData[], selectedBootcampIndex: number, inputs: any) => {
    console.log(saltData[selectedBootcampIndex])
    const template: Template = getTemplate(
        inputs,
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

export const mapTemplateInputsBootcampsToTemplateViewer = (bootcamp: any, pdfInput: any) => {
  const template: Template = getTemplate(
    pdfInput,
    {
        x: bootcamp.template.introStyling?.xPos ?? null,
        y: bootcamp.template.introStyling?.yPos ?? null,
    },
    {
        width: bootcamp.template.introStyling?.width ?? null,
        height: bootcamp.template.introStyling?.height ?? null,
    },
    bootcamp.template.introStyling?.fontSize ?? null,
    bootcamp.template.introStyling?.fontColor ?? null,
    bootcamp.template.introStyling?.fontName ?? null,
    bootcamp.template.introStyling?.alignment ?? null,
    {
        x: bootcamp.template.mainStyling?.xPos ?? null,
        y: bootcamp.template.mainStyling?.yPos ?? null,
    },
    {
        width: bootcamp.template.mainStyling?.width ?? null,
        height: bootcamp.template.mainStyling?.height ?? null,
    },
    bootcamp.template.mainStyling?.fontSize ?? null,
    bootcamp.template.mainStyling?.fontColor ?? null,
    bootcamp.template.mainStyling?.fontName ?? null,
    bootcamp.template.mainStyling?.alignment ?? null,
    {
        x: bootcamp.template.footerStyling?.xPos ?? null,
        y: bootcamp.template.footerStyling?.yPos ?? null,
    },
    {
        width: bootcamp.template.footerStyling?.width ?? null,
        height: bootcamp.template.footerStyling?.height ?? null,
    },
    bootcamp.template.footerStyling?.fontSize ?? null,
    bootcamp.template.footerStyling?.fontColor ?? null,
    bootcamp.template.footerStyling?.fontName ?? null,
    bootcamp.template.footerStyling?.alignment ?? null
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