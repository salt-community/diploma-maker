import React, { useEffect, useRef, useState } from "react";
import { Template } from "@pdfme/common";
import { getTemplate, makeTemplateInput } from "../templates/baseTemplate";
import { Form, Viewer } from "@pdfme/ui";
import { BootcampResponse, SaltData, displayMode } from "../util/types";
import {
  getFontsData,
  getPlugins,
  generatePDF,
  generateCombinedPDF,
} from "../util/helper";
import AddDiplomaForm from "../components/AddDiplomaForm";
import { useParams } from "react-router-dom";

const saltDefaultData: SaltData = {
  classname: ".Net Fullstack",
  dategraduate: '12/04/2024',
  names: ["John Smith"]
};

type Props = {
  bootcamps: BootcampResponse[] | null;
};

export default function DiplomaMaking({ bootcamps }: Props) {
  const [saltData, setSaltData] = useState<SaltData[]>([saltDefaultData])
  const [currentDisplayMode, setDisplayMode] = useState<displayMode>("form");
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [selectedBootcampIndex, setSelectedBootcampIndex] = useState<number>(0);

  const uiRef = useRef<HTMLDivElement | null>(null);
  const uiInstance = useRef<Form | Viewer | null>(null);

  const { selectedBootcamp } = useParams<{ selectedBootcamp: string }>();

  // When page starts -> Puts backend data into saltData
  useEffect(() => {
    if (bootcamps) {
      if(selectedBootcamp){
        setSelectedBootcampIndex(Number(selectedBootcamp));
      }
      if (bootcamps[selectedBootcampIndex].diplomas.length === 0) {
        setSaltData([saltDefaultData]);
      } 
      else {
        const initialSaltData: SaltData[] = bootcamps.map((bootcamp) => {
          if (bootcamp.diplomas.length === 0) {
            return {
              classname: bootcamp.name,
              dategraduate: bootcamp.graduationDate.toString().slice(0, 10),
              names: saltDefaultData.names,
            };
          } else {
            return {
              classname: bootcamp.name,
              dategraduate: bootcamp.graduationDate.toString().slice(0, 10),
              names: bootcamp.diplomas.map((diploma) => diploma.studentName),
            };
          }
        });
        setSaltData(initialSaltData)
      }
    }
  }, [bootcamps]);

  // When Page Changes -> Loads in to PDF preview
  useEffect(() => {
    const template: Template = getTemplate();
    const inputs = [makeTemplateInput(saltData[selectedBootcampIndex].names[currentPageIndex], saltData[selectedBootcampIndex].classname, saltData[selectedBootcampIndex].dategraduate)];

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
  }, [uiRef, currentDisplayMode, currentPageIndex, selectedBootcampIndex, saltData]);

  const updateSaltDataHandler = (data: SaltData) => {
    setSaltData(prevSaltInfoProper =>
      prevSaltInfoProper.map((item, index) =>
        index === selectedBootcampIndex
          ? { ...item, names: data.names }
          : item
      )
    );

    setCurrentPageIndex(0);
  };

  const changeDisplayModeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as displayMode;
    setDisplayMode(value);
  };

  const prevTemplateInstanceHandler = () => {
    setCurrentPageIndex((prevIndex) =>
      prevIndex === 0 ? saltData[selectedBootcampIndex].names.length - 1 : prevIndex - 1
    );
  };

  const nextTemplateInstanceHandler = () => {
    setCurrentPageIndex((prevIndex) =>
      prevIndex === saltData[selectedBootcampIndex].names.length - 1 ? 0 : prevIndex + 1
    );
  };

  const generatePDFHandler = async () => {
    if (uiInstance.current) {
      const inputs = uiInstance.current.getInputs();
      const template = getTemplate();
      await generatePDF(template, inputs);
    }
  };

  const generateCombinedPDFHandler = async () => {
    const inputsArray = saltData[selectedBootcampIndex].names.map((_, index) => {
      return [makeTemplateInput(saltData[selectedBootcampIndex].names[index], saltData[selectedBootcampIndex].classname, saltData[selectedBootcampIndex].dategraduate)];
    });

    await generateCombinedPDF(saltData[selectedBootcampIndex].names.map(() => getTemplate()), inputsArray);
  };

  return (
    <div className="flex w-full h-screen justify-between pt-10 dark: bg-darkbg">
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
        </header>
        <div
          ref={uiRef}
          style={{ width: "100%", height: "calc(95vh - 68px)" }}
        />
        <div className="flex justify-center mt-4">
          <button onClick={prevTemplateInstanceHandler}>Previous</button>
          <span className="mx-4">
            Template {currentPageIndex + 1} of {saltData[selectedBootcampIndex].names.length}
          </span>
          <button onClick={nextTemplateInstanceHandler}>Next</button>
        </div>
      </section>
      <section className="flex-1 flex flex-col">
        <AddDiplomaForm 
          updateSaltData={updateSaltDataHandler} 
          bootcamps={bootcamps} 
          setSelectedBootcampIndex={(index) => {setSelectedBootcampIndex(index); setCurrentPageIndex(0);}}
          saltData={saltData[selectedBootcampIndex]}
        />
      </section>
    </div>
  );
}