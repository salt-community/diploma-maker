import { Template, Font, checkTemplate } from "@pdfme/common";
import { Form, Viewer, Designer } from "@pdfme/ui";
import { text, barcodes, image } from "@pdfme/schemas"
import plugins from "../plugins"

export const readFile = (
    file: File | null,
    type: "text" | "dataURL" | "arrayBuffer"
  ) => {
    return new Promise<string | ArrayBuffer>((r) => {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", (e) => {
        if (e && e.target && e.target.result && file !== null) {
          r(e.target.result);
        }
      });
      if (file !== null) {
        if (type === "text") {
          fileReader.readAsText(file);
        } else if (type === "dataURL") {
          fileReader.readAsDataURL(file);
        } else if (type === "arrayBuffer") {
          fileReader.readAsArrayBuffer(file);
        }
      }
    });
  };

const getTemplateFromJsonFile = (file: File) => {
    return readFile(file, "text").then((jsonStr) => {
      const template: Template = JSON.parse(jsonStr as string);
      try {
        checkTemplate(template);
        return template;
      } catch (e) {
        throw e;
      }
    });
  };

export const handleLoadTemplate = (e: React.ChangeEvent<HTMLInputElement>,currentRef: Designer | Form | Viewer | null) => {
    if (e.target && e.target.files) {
        getTemplateFromJsonFile(e.target.files[0])
        .then((t) => {
            if (!currentRef) return;
            currentRef.updateTemplate(t);
        })
        .catch((e) => {
            alert(`Invalid template file.
            --------------------------
            ${e}`);
                });
            }
};
  
export const getPlugins = () => {
    return {
        Text: text,
        Signature: plugins.signature,
        QR: barcodes.qrcode,
        Image: image,
    }
}