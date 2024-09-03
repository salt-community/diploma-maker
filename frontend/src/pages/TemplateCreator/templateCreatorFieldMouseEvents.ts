import { Designer } from "@pdfme/ui"; // Import your types

export const handleFieldMouseEvents = (
  designer: React.MutableRefObject<Designer | null>,
  selectedField: string | null,
  setFieldsChanged: (value: boolean) => void,
  setCurrentFieldPosition: (position: any) => void,
  setTemplateStyle: (style: any) => void,
  delay: (ms: number) => Promise<void>
) => {
  if (designer.current && selectedField) {
    const handleMouseUp = async () => {
      // @ts-ignore
      const prevStartPost = designer.current.template.schemas[0][selectedField]?.position;
      await delay(10);
      // @ts-ignore
      const startpos = designer.current.template.schemas[0][selectedField]?.position;
      if (prevStartPost.x !== startpos.x || prevStartPost.y !== startpos.y) {
        setFieldsChanged(true);
      }
      setCurrentFieldPosition(startpos);
      setTemplateStyle((prevState: any) => ({
        ...prevState,
        positionX: startpos?.x,
        positionY: startpos?.y,
      }));
    };

    const handleMouseDown = () => {
      // @ts-ignore
      const startpos = designer.current.template.schemas[0][selectedField]?.position;
      setCurrentFieldPosition(startpos);
      setTemplateStyle((prevState: any) => ({
        ...prevState,
        positionX: startpos?.x,
        positionY: startpos?.y,
      }));
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }
};