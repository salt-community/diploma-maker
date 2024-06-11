import { useEffect, useRef, useState } from "react";
import { Template, checkTemplate } from "@pdfme/common";
import { getTemplate } from "../templates/baseTemplate";
import { Form, Viewer } from "@pdfme/ui";
import { BootcampResponse, displayMode } from "../util/types";
import {
  getFontsData,
  getPlugins,
  generatePDF,
  generateCombinedPDF,
} from "../util/helper";
import AddDiplomaForm from "../components/AddDiplomaForm";

type SaltData = {
  classname: string;
  datebootcamp: string;
  names: string[];
};

const saltInitData = {
  classname: ".Net Fullstack",
  datebootcamp: "2024-06-08",
  names: ["Xinnan Luo"]
}

// const initTemplate = () => {
//   let template: Template = getTemplate();
//   try {
//     const templateString = localStorage.getItem("template");
//     const templateJson = templateString
//       ? JSON.parse(templateString)
//       : getTemplate();
//     checkTemplate(templateJson);
//     template = templateJson as Template;
//   } catch {
//     localStorage.removeItem("template");
//   }
//   return template;
// };

const initTemplates = (saltData: SaltData): Template[] => {
  return saltData.names.map((studentName, idx) => {
    let template: Template = getTemplate();
    try {
      const templateString = localStorage.getItem(`template_${idx}`);
      const templateJson = templateString
        ? JSON.parse(templateString)
        : getTemplate();

      checkTemplate(templateJson);
      template = templateJson as Template;
      // @ts-ignore
      template.sampledata[0] = {
        "name": studentName,
        "course-date": `has successfully completed\nthe ${saltData.classname} Bootcamp of ${saltData.datebootcamp} at School of Applied Technology.`,
        "intro": "This certifies that\n",
      };

    } catch {
      localStorage.removeItem(`template_${idx}`);
    }

    return template;
  });
};

type Props = {
  bootcamps: BootcampResponse[] | null;
}

export default function DiplimaMaking({bootcamps}: Props){
    const [SaltInfo, setSaltInfo] = useState<SaltData>(saltInitData);
    const [displayMode, setDisplayMode] = useState<displayMode>("form");
    const [templates, setTemplates] = useState<Template[]>(initTemplates(SaltInfo));
    const [currentTemplateIndex, setCurrentTemplateIndex] = useState<number>(0);
    

    const uiRef = useRef<HTMLDivElement | null>(null);
    const uiInstance = useRef<Form | Viewer | null>(null);

    useEffect(() => {
      setTemplates(initTemplates(SaltInfo));
    }, [SaltInfo]);

    useEffect(() => {
      const template: Template = templates[currentTemplateIndex];
      let inputs = template.sampledata ?? [{}];
      try {
        const inputsString = localStorage.getItem(`inputs_${currentTemplateIndex}`);
        const inputsJson = inputsString
          ? JSON.parse(inputsString)
          : template.sampledata ?? [{}];

        inputs = inputsJson;

      } catch {
        localStorage.removeItem(`inputs_${currentTemplateIndex}`);
      }
  
      getFontsData().then((font) => {
        if (uiRef.current) {
          if (uiInstance.current) {
            uiInstance.current.destroy();
          }
          uiInstance.current = new (displayMode === "form" ? Form : Viewer)({
            domContainer: uiRef.current,
            template,
            // @ts-ignore
            inputs,
            options: { font },
            plugins: getPlugins(),
          });
  
        }
      });
  
      return () => {
        if (uiInstance.current) {
          uiInstance.current.destroy();
          uiInstance.current = null;
        }
      };
    }, [uiRef, displayMode, currentTemplateIndex, templates]);

    // useEffect(() => {
    //   const template = initTemplate();
    //   let inputs = SaltInfo ? [{
    //       "course-date": `has successfully completed\nthe ${SaltInfo.classname} Bootcamp of ${SaltInfo.datebootcamp} at School of Applied Technology.`,
    //       "intro": "This certifies that\n",
    //       "name": `${SaltInfo.names}`,
    //   }] : template.sampledata ;
      
    //   getFontsData().then((font) => {
    //     if (uiRef.current) {
    //       ui.current = new (displayMode === "form" ? Form : Viewer)({
    //         domContainer: uiRef.current,
    //         template,
    //         inputs,
    //         options: { font },
    //         plugins: getPlugins(),
    //       });
    //     }
    //   });
    //   return () => {
    //     if (ui.current) {
    //       ui.current.destroy();
    //     }
    //   };
    // }, [uiRef, displayMode, SaltInfo]);

    const UpdateSaltInfo = (data: SaltData) => {
        setSaltInfo(data);
    }

    const changeDisplayModeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value as displayMode;
      setDisplayMode(value);
    };

    const prevTemplateInstanceHandler = () => {
      setCurrentTemplateIndex((prevIndex) =>
        prevIndex === 0 ? templates.length - 1 : prevIndex - 1
      );
    };
  
    const nextTemplateInstanceHandler = () => {
      setCurrentTemplateIndex((prevIndex) =>
        prevIndex === templates.length - 1 ? 0 : prevIndex + 1
      );
    };

    const saveInputsHandler = () => {
      if (uiInstance.current) {
        const inputs = uiInstance.current.getInputs();
        localStorage.setItem(`inputs_${currentTemplateIndex}`, JSON.stringify(inputs));
      }
    };

    const generatePDFHandler = async () => {
      if (uiInstance.current) {
        const inputs = uiInstance.current.getInputs();
        const template = templates[currentTemplateIndex];
        await generatePDF(template, inputs);
      }
    };

    const generateCombinedPDFHandler = async () => {
      const inputsArray = templates.map((_, index) => {
        const inputsString = localStorage.getItem(`inputs_${index}`);
        return inputsString ? JSON.parse(inputsString) : templates[index].sampledata ?? [{}];
      });
  
      await generateCombinedPDF(templates, inputsArray);
    }

    return (
      <div className="flex w-full h-screen justify-between mt-2">
        <section className="flex-1 flex flex-col justify-start gap-1 ml-5">
          <header className="flex items-center justify-start gap-3 mb-2">
            <div>
              <input
                type="radio"
                onChange={changeDisplayModeHandler}
                id="form"
                value="form"
                checked={displayMode === "form"}
              />
              <label htmlFor="form">Form</label>
              <input
                type="radio"
                onChange={changeDisplayModeHandler}
                id="viewer"
                value="viewer"
                checked={displayMode === "viewer"}
              />
              <label htmlFor="viewer">Viewer</label>
            </div>
            <button className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={generatePDFHandler}>Generate PDF</button>
            <button className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={generateCombinedPDFHandler}>Generate PDFs</button>
            <button className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={saveInputsHandler}>Save Changes</button>
          </header>
          <div
            ref={uiRef}
            style={{ width: "100%", height: "calc(95vh - 68px)" }}
          />
          <div className="flex justify-center mt-4">
            <button onClick={prevTemplateInstanceHandler}>Previous</button>
            <span className="mx-4">
              Template {currentTemplateIndex + 1} of {templates.length}
            </span>
            <button onClick={nextTemplateInstanceHandler}>Next</button>
          </div>
        </section>
        <section className="flex-1 flex flex-col">
          <AddDiplomaForm SetFormInfo={UpdateSaltInfo} bootcamps={bootcamps} />
        </section>
      </div>
    );
    
}