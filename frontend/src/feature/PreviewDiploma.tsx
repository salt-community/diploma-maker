import { useEffect, useState, useRef } from "react";
import { displayMode, SaltData } from "../util/types";
import { generatePDF, getFontsData, getPlugins, newGenerateCombinedPDF } from "../util/helper";
import { Form, Viewer } from "@pdfme/ui";
import { mapTemplateInputsToTemplateViewer, templateInputsFromBootcampData, templateInputsFromSaltData } from "../util/dataHelpers";
import { makeTemplateInput } from "../templates/baseTemplate";
import { Template } from "@pdfme/common";
import { SwitchComponent } from "../components/MenuItems/Inputs/SwitchComponent";
import { PublishButton } from "../components/MenuItems/Buttons/PublishButton";
import { SaveButton } from "../components/MenuItems/Buttons/SaveButton";
import { PaginationMenu } from "../components/MenuItems/PaginationMenu";

type Props = {
  saltData: SaltData | null;
  updateSaltNameForbootcamp: (name : string, index: number) => void;
  selectedBootcampIndex: number
  postSelectedBootcampData: (saltData: SaltData) => void
};

export default function PreviewDiploma({saltData, updateSaltNameForbootcamp, selectedBootcampIndex, postSelectedBootcampData}: Props) {

  const [currentDisplayMode, setDisplayMode] = useState<displayMode>("form");
  const uiRef = useRef<HTMLDivElement | null>(null);
  const uiInstance = useRef<Form | Viewer | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // When Page Changes -> Loads into PDF preview
  useEffect(() => {  
    const inputs = templateInputsFromSaltData(saltData, currentPageIndex)
    const template = mapTemplateInputsToTemplateViewer(saltData, inputs[0]);

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
    }, [currentDisplayMode, currentPageIndex, saltData]);

  const handleToggle = (checked: boolean) => {
    setDisplayMode(checked ? "form" : "viewer");
  };

  const generatePDFHandler = async () => {
    if (uiInstance.current) {
      const inputs = uiInstance.current.getInputs();
      const pdfInput = makeTemplateInput(
        inputs[0].header,
        inputs[0].main,
        inputs[0].footer,
        inputs[0].pdfbase,
        inputs[0].link
      );
      const template = mapTemplateInputsToTemplateViewer(saltData, pdfInput);
      await generatePDF(template, inputs);
      await postSelectedBootcampData(saltData);
    }
  };
  const saveInputFieldsHandler = () => {
    if (uiInstance.current) {
      const inputs = uiInstance.current.getInputs();
      const newName = inputs[0].main;
      updateSaltNameForbootcamp(newName, selectedBootcampIndex);
    }
  };

  const prevTemplateInstanceHandler = () => {
    if (saltData) {
      setCurrentPageIndex((prevIndex) =>
        prevIndex === 0 ? saltData.students.length - 1 : prevIndex - 1
      );
    }
  };

  const nextTemplateInstanceHandler = () => {
    
      setCurrentPageIndex((prevIndex) =>
        prevIndex === saltData.students.length - 1 ? 0 : prevIndex + 1
      );

  };

  const generateCombinedPDFHandler = async () => {
    
      const inputsArray = saltData.students.map((student) => {
        return templateInputsFromBootcampData(saltData, student.name, student.verificationCode);
      });

      const templatesArr: Template[] = [];
      for (let i = 0; i < inputsArray.length; i++) {
        templatesArr.push(
          mapTemplateInputsToTemplateViewer(saltData, inputsArray[i])
        );
      }
      await newGenerateCombinedPDF(templatesArr, inputsArray);
      await postSelectedBootcampData(saltData); 
    
  };

  return (
    <>
      <header className="flex items-center justify-start gap-3 mb-5 viewersidebar-container">
        <div>
          <SwitchComponent
            checked={currentDisplayMode === "form"}
            onToggle={handleToggle}
          />
        </div>
        <PublishButton text="Generate PDF" onClick={generatePDFHandler} />
        <PublishButton text="Generate PDFs" onClick={generateCombinedPDFHandler} />
        <SaveButton textfield="" saveButtonType={'grandTheftAuto'} onClick={saveInputFieldsHandler} />
      </header>
      
        <>
          <div
            className="pdfpreview-container"
            ref={uiRef}
            style={{ width: "100%", height: "calc(82vh - 68px)" }}
          />
          <PaginationMenu
            containerClassOverride="flex justify-center mt-4 pagination-menu"
            currentPage={currentPageIndex + 1}
            totalPages={saltData.students.length}
            handleNextPage={nextTemplateInstanceHandler}
            handlePrevPage={prevTemplateInstanceHandler}
          />
        </>
  
    </>
  );
}
