import { useEffect, useRef, useState } from "react";
import AddDeplomaForm from "../components/AddDiplomaForm";
import PDFGenerator from "../components/PDFGenerator";
import { Template, checkTemplate } from "@pdfme/common";
import { getTemplate } from "../templates/baseTemplate";
import { Form, Viewer } from "@pdfme/ui";
import {
  getFontsData,
  handleLoadTemplate,
  generatePDF,
  getPlugins,
  isJsonString,
} from "../util/helper";

type Mode = "form" | "viewer";

// FOR ONE TEMPLATE
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

// FOR MULTIBLE INSTANCED TEMPLATES
const initTemplates = (studentNames: string[]): Template[] => {
  return studentNames.map((studentName, index) => {
    let template: Template = getTemplate();
    try {
      const templateString = localStorage.getItem(`template_${index}`);
      const templateJson = templateString
        ? JSON.parse(templateString)
        : getTemplate();
      checkTemplate(templateJson);
      template = templateJson as Template;
    } catch {
      localStorage.removeItem(`template_${index}`);
    }
    template.sampledata = [{ studentName }];
    return template;
  });
};

export default function DiplimaMaking(){
    const [studentNames, setStudentNames] = useState<string[]>([
      "matilda",
      "xian",
      "tom",
    ]);
    const [templates, setTemplates] = useState<Template[]>(initTemplates(studentNames));
    const [currentTemplateIndex, setCurrentTemplateIndex] = useState<number>(0);

    const uiRef = useRef<HTMLDivElement | null>(null);
    // const ui = useRef<Form | Viewer | null>(null);
    const uiInstance = useRef<Form | Viewer | null>(null);

    const [mode, setMode] = useState<Mode>(
      (localStorage.getItem("mode") as Mode) ?? "form"
    );

    useEffect(() => {
      setTemplates(initTemplates(studentNames));
    }, [studentNames]);

    // FOR ONE TEMPLATE
    // useEffect(() => {
    //   const template = initTemplate();
    //   let inputs = template.sampledata ?? [{}];
    //   try {
    //     const inputsString = localStorage.getItem("inputs");
    //     const inputsJson = inputsString
    //       ? JSON.parse(inputsString)
    //       : template.sampledata ?? [{}];
    //     inputs = inputsJson;
    //   } catch {
    //     localStorage.removeItem("inputs");
    //   }
  
    //   getFontsData().then((font) => {
    //     if (uiRef.current) {
    //       ui.current = new (mode === "form" ? Form : Viewer)({
    //         domContainer: uiRef.current,
    //         template,
    //         inputs,
    //         options: { font },
    //         plugins: getPlugins(),
    //       });
    //     }
    //   });

    // FOR MULTIBLE INSTANCED TEMPLATES
    useEffect(() => {
      const template = templates[currentTemplateIndex];
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
          uiInstance.current = new (mode === "form" ? Form : Viewer)({
            domContainer: uiRef.current,
            template,
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
    }, [uiRef, mode, currentTemplateIndex, templates]);

    const changeModeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value as Mode;
      setMode(value);
      localStorage.setItem("mode", value);
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
      if (ui.current) {
        const inputs = ui.current.getInputs();
        localStorage.setItem("inputs", JSON.stringify(inputs));
        console.log("saved changes!");
      }
    };

    const updateStudentNamesHandler = (input: string) => {
      if(input == ""){
        setStudentNames(["Xian Lau"])
        return
      }
      const names = input.split('\n').map(name => name.trim()).filter(name => name !== "");
      setStudentNames(names);
    };

    return (
        <>
          {/* <PDFGenerator names={studentNames}/> */}
          <div>
            <header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginRight: 120,
              }}
            >
              <strong>Form, Viewer</strong>
              <span style={{ margin: "0 1rem" }}>:</span>
              <div>
                <input
                  type="radio"
                  onChange={changeModeHandler}
                  id="form"
                  value="form"
                  checked={mode === "form"}
                />
                <label htmlFor="form">Form</label>
                <input
                  type="radio"
                  onChange={changeModeHandler}
                  id="viewer"
                  value="viewer"
                  checked={mode === "viewer"}
                />
                <label htmlFor="viewer">Viewer</label>
              </div>
              {/* <label style={{ width: 180 }}>
                Load Template
                <input
                  type="file"
                  accept="application/json"
                  onChange={(e) => handleLoadTemplate(e, ui.current)}
                />
              </label> */}
              <button onClick={() => generatePDF(ui.current)}>Generate PDF</button>
            </header>
            <div
              ref={uiRef}
              style={{ width: "100%", height: `calc(100vh - 68px)` }}
            />
            <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
              <button onClick={prevTemplateInstanceHandler}>Previous</button>
              <span style={{ margin: "0 1rem" }}>
                Template {currentTemplateIndex + 1} of {templates.length}
              </span>
              <button onClick={nextTemplateInstanceHandler}>Next</button>
            </div>
          </div>
          <section>
            <button onClick={saveInputsHandler}>Save Changes</button>
            <AddDeplomaForm updateStudentNames = {(e) => updateStudentNamesHandler(e)}/>
          </section>
        </>
    )
}