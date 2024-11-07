import { Template, BLANK_PDF } from '@pdfme/common';
import { TemplateRequest, TemplateResponse } from '../api/dtos/templates';

export function pdfMeTemplateFromTemplateDto(templateResponse: TemplateResponse | TemplateRequest) {
    return {
        basePdf: BLANK_PDF,
        schemas: [
            [
                {
                    name: 'footer',
                    type: 'text',
                    position: {
                        x: templateResponse.footerStyling.xPos,
                        y: templateResponse.footerStyling.yPos
                    },
                    width: templateResponse.footerStyling.width,
                    height: templateResponse.footerStyling.height,
                },
                {
                    name: 'intro',
                    type: 'text',
                    position: {
                        x: templateResponse.introStyling.xPos,
                        y: templateResponse.introStyling.yPos
                    },
                    width: templateResponse.introStyling.width,
                    height: templateResponse.introStyling.height,
                },
                {
                    name: 'main',
                    type: 'text',
                    position: {
                        x: templateResponse.mainStyling.xPos,
                        y: templateResponse.mainStyling.yPos
                    },
                    width: templateResponse.mainStyling.width,
                    height: templateResponse.mainStyling.height,
                },
                {
                    name: 'link',
                    type: 'text',
                    position: {
                        x: templateResponse.linkStyling.xPos,
                        y: templateResponse.linkStyling.yPos
                    },
                    width: templateResponse.linkStyling.width,
                    height: templateResponse.linkStyling.height,
                }
            ]
        ]
    } as Template;
}
