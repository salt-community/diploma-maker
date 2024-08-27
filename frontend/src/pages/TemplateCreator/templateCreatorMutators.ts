import Designer from "@pdfme/ui/dist/types/Designer";
import { pdfSize, TemplateInstanceStyle } from "../../util/types";
import { calculateCanvasSizeFromPdfSize } from "../../util/templateCreatorUtil";

export const setAlignVerticalCenter = (
  designer: React.MutableRefObject<Designer>, 
  selectedField: string, 
  pdfSize: pdfSize, 
  setTemplateStyle: (value: React.SetStateAction<TemplateInstanceStyle>) => void, 
  setFieldsChanged: (changed: boolean) => void
) => {
  if (designer.current && selectedField && pdfSize) {
    // @ts-ignore
    const selectedFieldHeight = designer.current.template.schemas[0][selectedField].height;
    const centerPosition = ((calculateCanvasSizeFromPdfSize(pdfSize.height)) - selectedFieldHeight) / 2;
    // @ts-ignore
    designer.current.template.schemas[0][selectedField].position.y = centerPosition;
    // @ts-ignore
    designer.current.updateTemplate(designer.current.template);

    setTemplateStyle(prevState => ({ ...prevState, positionY: centerPosition }));
    setFieldsChanged(true)
  }
};


export const setAlignHorizontalCenter = (
  designer: React.MutableRefObject<Designer>, 
  selectedField: string,
  pdfSize: pdfSize, 
  setTemplateStyle: (value: React.SetStateAction<TemplateInstanceStyle>) => void, 
  setFieldsChanged: (changed: boolean) => void,
) => {
  if (designer.current && selectedField && pdfSize) {
    // @ts-ignore
    const selectedFieldWidth = designer.current.template.schemas[0][selectedField].width;

    const centerPosition = ((calculateCanvasSizeFromPdfSize(pdfSize.width)) - selectedFieldWidth) / 2;
    // @ts-ignore
    designer.current.template.schemas[0][selectedField].position.x = centerPosition;
    // @ts-ignore
    designer.current.updateTemplate(designer.current.template);

    setTemplateStyle(prevState => ({ ...prevState, positionX: centerPosition }));
    setFieldsChanged(true)
  }
};

export const setFontColorHandler = async (
  value: string,
  designer: React.MutableRefObject<Designer>, 
  selectedField: string,
  setTemplateStyle: (value: React.SetStateAction<TemplateInstanceStyle>) => void,
  setFieldsChanged: (value: React.SetStateAction<boolean>) => void
) => {
  setTemplateStyle(prevState => ({ ...prevState, fontColor: value }));
  if (designer.current && selectedField) {
    // @ts-ignore
    designer.current.template.schemas[0][selectedField].fontColor = value;
    // @ts-ignore
    designer.current.updateTemplate(designer.current.template);
    setFieldsChanged(true)
  }
};