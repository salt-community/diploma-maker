import { useEffect, useRef, useState } from "react";
import { Template, checkTemplate } from "@pdfme/common";
import { getTemplate } from "../templates/baseTemplate";
import { Form, Viewer } from "@pdfme/ui";
import { displayMode } from "../util/types";
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
  names: string;
};

const initTemplate = () => {
  let template: Template = getTemplate();
  try {
    const templateString = localStorage.getItem("template");
    const templateJson = templateString
      ? JSON.parse(templateString)
      : getTemplate();
    checkTemplate(templateJson);
    template = templateJson as Template;
  } catch {
    localStorage.removeItem("template");
  }
  return template;
};

// const initTemplates = (studentNames: string[]): Template[] => {
//   return studentNames.map((studentName, idx) => {
//     let template: Template = getTemplate(); 
//     try {
//       const templateString = localStorage.getItem(`template_${idx}`);

//       const templateJson = templateString
//         ? JSON.parse(templateString)
//         : getTemplate();

//       checkTemplate(templateJson);
//       template = templateJson as Template;
//       template.sampledata[0].namecopy2 = studentName;

//     } catch {
//       localStorage.removeItem(`template_${idx}`);
//     }

//     return template;
//   });
// };

export default function DiplimaMaking(){
    const [SaltInfo, setSaltInfo] = useState<SaltData>();
    const [studentNames, setStudentNames] = useState<string[]>([]);
    const [displayMode, setDisplayMode] = useState<displayMode>("form");
    // const [studentNames, setStudentNames] = useState<string[]>([
    //   "Xinnan Luo",
    // ]);
    // const [templates, setTemplates] = useState<Template[]>(initTemplates(studentNames));
    // const [currentTemplateIndex, setCurrentTemplateIndex] = useState<number>(0);
    
    const uiRef = useRef<HTMLDivElement | null>(null);
    const ui = useRef<Form | Viewer | null>(null);
    // const uiInstance = useRef<Form | Viewer | null>(null);

    // useEffect(() => {
    //   setTemplates(initTemplates(studentNames));
    // }, [studentNames]);

    // useEffect(() => {
    //   const template: Template = templates[currentTemplateIndex];
    //   let inputs = template.sampledata ?? [{}];
    //   try {
    //     const inputsString = localStorage.getItem(`inputs_${currentTemplateIndex}`);
    //     const inputsJson = inputsString
    //       ? JSON.parse(inputsString)
    //       : template.sampledata ?? [{}];

    //     inputs = inputsJson;

    //   } catch {
    //     localStorage.removeItem(`inputs_${currentTemplateIndex}`);
    //   }
  
    //   getFontsData().then((font) => {
    //     if (uiRef.current) {
    //       if (uiInstance.current) {
    //         uiInstance.current.destroy();
    //       }
    //       uiInstance.current = new (displayMode === "form" ? Form : Viewer)({
    //         domContainer: uiRef.current,
    //         template, // <-- Current active Template Loads in here
    //         // @ts-ignore
    //         inputs,
    //         options: { font },
    //         plugins: getPlugins(),
    //       });
  
    //     }
    //   });
  
    //   return () => {
    //     if (uiInstance.current) {
    //       uiInstance.current.destroy();
    //       uiInstance.current = null;
    //     }
    //   };
    // }, [uiRef, displayMode, currentTemplateIndex, templates]);

    useEffect(() => {
      const template = initTemplate();
      let inputs = SaltInfo ? [{
          "course-date": `has successfully completed\nthe ${SaltInfo.classname} Bootcamp of ${SaltInfo.datebootcamp} at School of Applied Technology.`,
          "intro": "This certifies that\n",
          "name": `${SaltInfo.names}`,
      }] : template.sampledata ;
      // try {
      //   const inputsString = localStorage.getItem("inputs");
      //   const inputsJson = inputsString
      //     ? JSON.parse(inputsString)
      //     : template.sampledata ?? [{}];
      //   inputs = inputsJson;
      // } catch {
      //   localStorage.removeItem("inputs");
      // }
      getFontsData().then((font) => {
        if (uiRef.current) {
          ui.current = new (displayMode === "form" ? Form : Viewer)({
            domContainer: uiRef.current,
            template,
            inputs,
            options: { font },
            plugins: getPlugins(),
          });
        }
      });
      return () => {
        if (ui.current) {
          ui.current.destroy();
        }
      };
    }, [uiRef, displayMode, SaltInfo]);

    const UpdateSaltInfo = (data: SaltData) => {
        setSaltInfo(data);
    }

    // const updateStudentNamesHandler = (input: string) => {
      
    //   if(input == ""){
    //     setStudentNames(["Xinnan Luo"]);
    //     return;
    //   }
    //   const names = input.split('\n').map(name => name.trim()).filter(name => name !== "");
    //   setStudentNames(names);
    // };

    const changeDisplayModeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value as displayMode;
      setDisplayMode(value);
    };

    // const prevTemplateInstanceHandler = () => {
    //   setCurrentTemplateIndex((prevIndex) =>
    //     prevIndex === 0 ? templates.length - 1 : prevIndex - 1
    //   );
    // };
  
    // const nextTemplateInstanceHandler = () => {
    //   setCurrentTemplateIndex((prevIndex) =>
    //     prevIndex === templates.length - 1 ? 0 : prevIndex + 1
    //   );
    // };

    // const saveInputsHandler = () => {
    //   if (uiInstance.current) {
    //     const inputs = uiInstance.current.getInputs();
    //     localStorage.setItem(`inputs_${currentTemplateIndex}`, JSON.stringify(inputs));
    //   }
    // };

    // const generatePDFHandler = async () => {
    //   if (uiInstance.current) {
    //     const inputs = uiInstance.current.getInputs();
    //     const template = templates[currentTemplateIndex];
    //     await generatePDF(template, inputs);
    //   }
    // };

    // const generateCombinedPDFHandler = async () => {
    //   const inputsArray = templates.map((_, index) => {
    //     const inputsString = localStorage.getItem(`inputs_${index}`);
    //     return inputsString ? JSON.parse(inputsString) : templates[index].sampledata ?? [{}];
    //   });
  
    //   await generateCombinedPDF(templates, inputsArray);
    // }

    return (
      <div className="flex w-full h-screen justify-between">
        <section className="flex-1 flex flex-col">
          <header className="flex items-center justify-between mb-4">
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
            {/* Optional buttons can be added here */}
            {/* <button onClick={generatePDFHandler}>Generate PDF</button>
            <button onClick={generateCombinedPDFHandler}>Generate PDFs</button>
            <button onClick={saveInputsHandler}>Save Changes</button> */}
          </header>
          <div
            ref={uiRef}
            style={{ width: "100%", height: "calc(95vh - 68px)" }}
          />
          {/* Optional navigation buttons can be added here */}
          {/* <div className="flex justify-center mt-4">
            <button onClick={prevTemplateInstanceHandler}>Previous</button>
            <span className="mx-4">
              Template {currentTemplateIndex + 1} of {templates.length}
            </span>
            <button onClick={nextTemplateInstanceHandler}>Next</button>
          </div> */}
        </section>
        <section className="flex-1 flex flex-col">
          <AddDiplomaForm SetFormInfo={UpdateSaltInfo} />
        </section>
      </div>
    );
    
}