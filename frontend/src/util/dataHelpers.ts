import { TemplateResponse } from "./types";

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