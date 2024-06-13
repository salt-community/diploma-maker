import React, { useEffect, useRef, useState } from "react";
import { Template, checkTemplate } from "@pdfme/common";
import { getTemplate, makeTemplateInput } from "../templates/baseTemplate";
import { Form, Viewer } from "@pdfme/ui";
import { BootcampResponse, displayMode } from "../util/types";
import {
  getFontsData,
  getPlugins,
  generatePDF,
  generateCombinedPDF,
} from "../util/helper";
import AddDiplomaForm from "../components/AddDiplomaForm";
import { deleteBootcampById } from "../services/bootcampService";
import { generate } from "@pdfme/generator";


type SaltData = {
  classname: string;
  datebootcamp: string;
  names: string[];
};

const saltInitData: SaltData = {
  classname: ".Net Fullstack",
  datebootcamp: "2024-06-08",
  names: ["Xinnan Luo"]
};

type Props = {
  bootcamps: BootcampResponse[] | null;
  deleteBootcamp: (i: number) => Promise<void>;
}

export default function DiplomaMaking({bootcamps, deleteBootcamp}: Props) {
  const [SaltInfo, setSaltInfo] = useState<SaltData>(saltInitData);
  const [currentDisplayMode, setDisplayMode] = useState<displayMode>("form");
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState<number>(0);
  const [selectedBootcampIndex, setSelectedBootcampIndex] = useState<number>(0);
  
  const uiRef = useRef<HTMLDivElement | null>(null);
  const uiInstance = useRef<Form | Viewer | null>(null);

  useEffect(() => {
    if (bootcamps) {
      setSaltInfo({
          classname: bootcamps[selectedBootcampIndex].name,
          datebootcamp: bootcamps[selectedBootcampIndex].graduationDate.toString(),
          names: bootcamps[selectedBootcampIndex].diplomas.map(diploma => diploma.studentName)
      });
    }
  }, [bootcamps]);

  useEffect(() => {    
    const template: Template = getTemplate();  
    const inputs = [makeTemplateInput(SaltInfo.names[currentTemplateIndex], SaltInfo.classname, SaltInfo.datebootcamp)];

    getFontsData().then((font) => {
      if (uiRef.current) {
        if (uiInstance.current) {
          uiInstance.current.destroy();
        }
        uiInstance.current = new (currentDisplayMode === "form" ? Form : Viewer)({
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
  }, [uiRef, currentDisplayMode, currentTemplateIndex, SaltInfo]);

  const UpdateSaltInfo = (data: SaltData) => {
    setSaltInfo(data);
    setCurrentTemplateIndex(0); 
  };

  const changeDisplayModeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as displayMode;
    setDisplayMode(value);
  };

  const prevTemplateInstanceHandler = () => {
    setCurrentTemplateIndex((prevIndex) =>
      prevIndex === 0 ? SaltInfo.names.length - 1 : prevIndex - 1
    );
  };

  const nextTemplateInstanceHandler = () => {
    setCurrentTemplateIndex((prevIndex) =>
      prevIndex === SaltInfo.names.length - 1 ? 0 : prevIndex + 1
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
      const template = getTemplate();
      await generatePDF(template, inputs);
    }
  };

  const generateCombinedPDFHandler = async () => {
    const inputsArray = SaltInfo.names.map((_, index) => {
      const inputsString = localStorage.getItem(`inputs_${index}`);
      return inputsString ? JSON.parse(inputsString) : [makeTemplateInput(SaltInfo.names[index], SaltInfo.classname, SaltInfo.datebootcamp)];
    });

    await generateCombinedPDF(SaltInfo.names.map(() => getTemplate()), inputsArray);
  };

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
              checked={currentDisplayMode === "form"}
            />
            <label htmlFor="form">Form</label>
            <input
              type="radio"
              onChange={changeDisplayModeHandler}
              id="viewer"
              value="viewer"
              checked={currentDisplayMode === "viewer"}
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
            Template {currentTemplateIndex + 1} of {SaltInfo.names.length}
          </span>
          <button onClick={nextTemplateInstanceHandler}>Next</button>
        </div>
      </section>
      <section className="flex-1 flex flex-col">
        <AddDiplomaForm SetFormInfo={UpdateSaltInfo} deleteBootcamp={deleteBootcamp} bootcamps={bootcamps}/>
      </section>
    </div>
  );
}

