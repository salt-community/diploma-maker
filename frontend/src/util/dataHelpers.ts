import { Template } from "@pdfme/common";
import { getTemplate, makeTemplateInput } from "../templates/baseTemplate";
import { populateField, populateIdField } from "./helper";
import { BootcampRequest, BootcampResponse, SaltData, TemplateRequest, TemplateResponse } from "./types";

export const templateInputsFromSaltData = (saltData: SaltData[], selectedBootcampIndex: number, currentPageIndex: number) => {
    const inputs = 
        [makeTemplateInput(
          populateField(
            // @ts-ignore
            saltData[selectedBootcampIndex].template.intro,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].students.length > 0 ? saltData[selectedBootcampIndex].students[currentPageIndex].name : "noname"
          ),
          populateField(
            // @ts-ignore
            saltData[selectedBootcampIndex].template.main,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].students.length > 0 ? saltData[selectedBootcampIndex].students[currentPageIndex].name : "noname"
          ),
          populateField(
            // @ts-ignore
            saltData[selectedBootcampIndex].template.footer,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate,
            saltData[selectedBootcampIndex].students.length > 0 ? saltData[selectedBootcampIndex].students[currentPageIndex].name : "noname"
          ),
          // @ts-ignore
          saltData[selectedBootcampIndex].template.basePdf,
          populateIdField(saltData[selectedBootcampIndex].template.link, saltData[selectedBootcampIndex].students[currentPageIndex].verificationCode)
        )];
    return inputs;
}

export const templateInputsFromBootcampData = (selectedBootcampData: SaltData, name: string, verificationCode: string) => {
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
    selectedBootcampData.template.basePdf,
    populateIdField(selectedBootcampData.template.link ,verificationCode)
  );
}

export const templateInputsSingleBootcampandTemplate = (bootcampData: BootcampResponse, templateData: TemplateResponse, studentName: string, studentVerificationCode: string) => {
  return [makeTemplateInput(
    populateField(
      // @ts-ignore
      templateData.intro,
      bootcampData.name,
      bootcampData.graduationDate.toString().slice(0, 10),
      studentName
    ),
    populateField(
      // @ts-ignore
      templateData.main,
      bootcampData.name,
      bootcampData.graduationDate.toString().slice(0, 10),
      studentName
    ),
    populateField(
      // @ts-ignore
      templateData.footer,
      bootcampData.name,
      bootcampData.graduationDate.toString().slice(0, 10),
      studentName
    ),
    // @ts-ignore
    templateData.basePdf,
    studentVerificationCode
  )]
}

export const mapTemplateInputsToTemplateViewer = (saltData: SaltData[], selectedBootcampIndex: number, inputs: any) => {
    const template: Template = getTemplate(
        inputs,
        { 
          x: saltData[selectedBootcampIndex].template.introStyling?.xPos ?? null, 
          y: saltData[selectedBootcampIndex].template.introStyling?.yPos ?? null
        }, // headerPos
        { 
          //@ts-ignore
          width: saltData[selectedBootcampIndex].template.introStyling?.width ?? null, 
          //@ts-ignore
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
        saltData[selectedBootcampIndex].template.footerStyling?.alignment ?? null, // footerAlignment
        { 
          x: saltData[selectedBootcampIndex].template.linkStyling?.xPos ?? null, 
          y: saltData[selectedBootcampIndex].template.linkStyling?.yPos ?? null 
        }, // linkPos
        { 
          width: saltData[selectedBootcampIndex].template.linkStyling?.width ?? null, 
          height: saltData[selectedBootcampIndex].template.linkStyling?.height ?? null
        }, // linkSize
        saltData[selectedBootcampIndex].template.linkStyling?.fontSize ?? null, // linkFontSize
        saltData[selectedBootcampIndex].template.linkStyling?.fontColor ?? null, // linkFontColor
        saltData[selectedBootcampIndex].template.linkStyling?.fontName ?? null, // linkFont
        saltData[selectedBootcampIndex].template.linkStyling?.alignment ?? null // linkAlignment
      );
    return template;
}

export const mapTemplateInputsToTemplateViewerSingle = (template: TemplateResponse, inputs: any) => {
  const templateOutput: Template = getTemplate(
      inputs,
      { 
        x: template.introStyling?.xPos ?? null, 
        y: template.introStyling?.yPos ?? null
      }, // headerPos
      { 
        //@ts-ignore
        width: template.introStyling?.width ?? null, 
        //@ts-ignore
        height: template.introStyling?.height ?? null
      }, // headerSize
      template.introStyling?.fontSize ?? null, // footerFontSize
      template.introStyling?.fontColor ?? null, // footerFontColor
      template.introStyling?.fontName ?? null, // footerFont
      template.introStyling?.alignment ?? null, // footerAlignment
      { 
        x: template.mainStyling?.xPos ?? null, 
        y: template.mainStyling?.yPos ?? null
      }, // mainPos
      { 
        width: template.mainStyling?.width ?? null, 
        height: template.mainStyling?.height ?? null
      }, // mainSize
      template.mainStyling?.fontSize ?? null, // footerFontSize
      template.mainStyling?.fontColor ?? null, // footerFontColor
      template.mainStyling?.fontName ?? null, // footerFont
      template.mainStyling?.alignment ?? null, // footerAlignment
      { 
        x: template.footerStyling?.xPos ?? null, 
        y: template.footerStyling?.yPos ?? null 
      }, // footerPos
      { 
        width: template.footerStyling?.width ?? null, 
        height: template.footerStyling?.height ?? null
      }, // footerSize
      template.footerStyling?.fontSize ?? null, // footerFontSize
      template.footerStyling?.fontColor ?? null, // footerFontColor
      template.footerStyling?.fontName ?? null, // footerFont
      template.footerStyling?.alignment ?? null, // footerAlignment
      { 
        x: template.linkStyling?.xPos ?? null, 
        y: template.linkStyling?.yPos ?? null 
      }, // linkPos
      { 
        width: template.linkStyling?.width ?? null, 
        height: template.linkStyling?.height ?? null
      }, // linkSize
      template.linkStyling?.fontSize ?? null, // linkFontSize
      template.linkStyling?.fontColor ?? null, // linkFontColor
      template.linkStyling?.fontName ?? null, // linkFont
      template.linkStyling?.alignment ?? null // linkAlignment
    );
  return templateOutput;
}

export const mapTemplateInputsBootcampsToTemplateViewer = (templateInput: TemplateResponse, pdfInput: any) => {
  const template: Template = getTemplate(
    pdfInput,
    {
        x: templateInput.introStyling?.xPos ?? null,
        y: templateInput.introStyling?.yPos ?? null,
    },
    {
        width: templateInput.introStyling?.width ?? null,
        height: templateInput.introStyling?.height ?? null,
    },
    templateInput.introStyling?.fontSize ?? null,
    templateInput.introStyling?.fontColor ?? null,
    templateInput.introStyling?.fontName ?? null,
    templateInput.introStyling?.alignment ?? null,
    {
        x: templateInput.mainStyling?.xPos ?? null,
        y: templateInput.mainStyling?.yPos ?? null,
    },
    {
        width: templateInput.mainStyling?.width ?? null,
        height: templateInput.mainStyling?.height ?? null,
    },
    templateInput.mainStyling?.fontSize ?? null,
    templateInput.mainStyling?.fontColor ?? null,
    templateInput.mainStyling?.fontName ?? null,
    templateInput.mainStyling?.alignment ?? null,
    {
        x: templateInput.footerStyling?.xPos ?? null,
        y: templateInput.footerStyling?.yPos ?? null,
    },
    {
        width: templateInput.footerStyling?.width ?? null,
        height: templateInput.footerStyling?.height ?? null,
    },
    templateInput.footerStyling?.fontSize ?? null,
    templateInput.footerStyling?.fontColor ?? null,
    templateInput.footerStyling?.fontName ?? null,
    templateInput.footerStyling?.alignment ?? null,
    {
      x: templateInput.linkStyling?.xPos ?? null,
      y: templateInput.linkStyling?.yPos ?? null,
  },
  {
      width: templateInput.linkStyling?.width ?? null,
      height: templateInput.linkStyling?.height ?? null,
  },
  templateInput.linkStyling?.fontSize ?? null,
  templateInput.linkStyling?.fontColor ?? null,
  templateInput.linkStyling?.fontName ?? null,
  templateInput.linkStyling?.alignment ?? null
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
        currentTemplate.footerStyling?.Alignment ?? null,
        {
          x: currentTemplate.linkStyling.XPos ?? null,
          y: currentTemplate.linkStyling.YPos ?? null,
        },
        {
            width: currentTemplate.linkStyling.Width ?? null,
            height: currentTemplate.linkStyling.Height ?? null,
        },
        currentTemplate.linkStyling?.FontSize ?? null,
        currentTemplate.linkStyling?.FontColor ?? null,
        currentTemplate.linkStyling?.FontName ?? null,
        currentTemplate.linkStyling?.Alignment ?? null
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
        link: template.link,
        linkStyling: {
            XPos: template.linkStyling?.xPos,
            YPos: template.linkStyling?.yPos,
            Width: template.linkStyling?.width,
            Height: template.linkStyling?.height,
            FontSize: template.linkStyling?.fontSize,
            FontColor: template.linkStyling?.fontColor,
            FontName: template.linkStyling?.fontName,
            Alignment: template.linkStyling?.alignment
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
        Width: currentTemplateFields.schemas[0].header.width,
        Height: currentTemplateFields.schemas[0].header.height,
        FontSize: currentTemplateFields.schemas[0].header.fontSize,
        FontColor: currentTemplateFields.schemas[0].header.fontColor,
        FontName: currentTemplateFields.schemas[0].header.fontName,
        Alignment: currentTemplateFields.schemas[0].header.alignment,
      },
      main: currentTemplateFields.sampledata[0].main,
      mainStyling: {
        XPos: currentTemplateFields.schemas[0].main.position.x,
        YPos: currentTemplateFields.schemas[0].main.position.y,
        Width: currentTemplateFields.schemas[0].main.width,
        Height: currentTemplateFields.schemas[0].main.height,
        FontSize: currentTemplateFields.schemas[0].main.fontSize,
        FontColor: currentTemplateFields.schemas[0].main.fontColor,
        FontName: currentTemplateFields.schemas[0].main.fontName,
        Alignment: currentTemplateFields.schemas[0].main.alignment,
      },
      footer: currentTemplateFields.sampledata[0].footer,
      footerStyling: {
        XPos: currentTemplateFields.schemas[0].footer.position.x,
        YPos: currentTemplateFields.schemas[0].footer.position.y,
        Width: currentTemplateFields.schemas[0].footer.width,
        Height: currentTemplateFields.schemas[0].footer.height,
        FontSize: currentTemplateFields.schemas[0].footer.fontSize,
        FontColor: currentTemplateFields.schemas[0].footer.fontColor,
        FontName: currentTemplateFields.schemas[0].footer.fontName,
        Alignment: currentTemplateFields.schemas[0].footer.alignment,
      },
      link: currentTemplateFields.sampledata[0].link,
      linkStyling: {
        XPos: currentTemplateFields.schemas[0].link.position.x,
        YPos: currentTemplateFields.schemas[0].link.position.y,
        Width: currentTemplateFields.schemas[0].link.width,
        Height: currentTemplateFields.schemas[0].link.height,
        FontSize: currentTemplateFields.schemas[0].link.fontSize,
        FontColor: currentTemplateFields.schemas[0].link.fontColor,
        FontName: currentTemplateFields.schemas[0].link.fontName,
        Alignment: currentTemplateFields.schemas[0].link.alignment,
      },
    };
    return updatedTemplate;
}

export const createBlankTemplate = (templateName: string) => {
    const blankTemplate: TemplateRequest = {
        templateName: templateName,
        intro: "",
        main: "",
        footer: "",
      }
    return blankTemplate;
}