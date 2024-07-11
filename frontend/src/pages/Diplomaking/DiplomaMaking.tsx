import { useEffect, useRef, useState } from "react";
import { Form, Viewer } from "@pdfme/ui";
import { BootcampResponse, StudentResponse, StudentsRequestDto, SaltData, displayMode, TemplateResponse } from "../../util/types";
import {
  getFontsData,
  getPlugins,
  generatePDF,
  newGenerateCombinedPDF,
  mapBootcampToSaltData,
} from "../../util/helper";
import DiplomaDataForm from "../../components/Forms/DiplomaDataForm";
import { useParams } from "react-router-dom";
import { PaginationMenu } from "../../components/MenuItems/PaginationMenu";
import { PublishButton } from "../../components/MenuItems/Buttons/PublishButton";
import './DiplomaMaking.css';
import { SwitchComponent } from "../../components/MenuItems/Inputs/SwitchComponent";
import { SaveButton, SaveButtonType } from "../../components/MenuItems/Buttons/SaveButton";
import { AlertPopup, PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import { saltDefaultData } from "../../data/data";
import { makeTemplateInput } from "../../templates/baseTemplate";
import { mapTemplateInputsToTemplateViewer, templateInputsFromBootcampData, templateInputsFromSaltData } from "../../util/dataHelpers";
import { Template } from "@pdfme/common";
import { useCustomAlert } from "../../components/Hooks/useCustomAlert";

type Props = {
  bootcamps: BootcampResponse[] | null;
  templates: TemplateResponse[] | null;
  addMultipleStudents: (studentsRequest: StudentsRequestDto) => Promise<StudentResponse[]>;
};

export default function DiplomaMaking({ bootcamps, templates, addMultipleStudents }: Props) {

  const [saltData, setSaltData] = useState<SaltData[] | null>();
  const [currentDisplayMode, setDisplayMode] = useState<displayMode>("viewer");
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [selectedBootcampIndex, setSelectedBootcampIndex] = useState<number>(0);  
  const uiRef = useRef<HTMLDivElement | null>(null);
  const uiInstance = useRef<Form | Viewer | null>(null);

  const { selectedBootcamp } = useParams<{ selectedBootcamp: string }>();
  const { showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();

  // When page starts -> Puts backend data into saltData
  useEffect(() => {
    if (bootcamps) {
      if(selectedBootcamp){
        setSelectedBootcampIndex(Number(selectedBootcamp));
      }
      if (bootcamps[selectedBootcampIndex].students.length === 0) {
        setSaltData([saltDefaultData]);
        
      } else {
        const initialSaltData = bootcamps.map(b => mapBootcampToSaltData(b))
        setSaltData(initialSaltData);
      }
    }
  }, [bootcamps]);

  // When Page Changes -> Loads into PDF preview
  useEffect(() => {
    
    if(saltData){
      const inputs = templateInputsFromSaltData(saltData, selectedBootcampIndex, currentPageIndex);
      const template = mapTemplateInputsToTemplateViewer(saltData, selectedBootcampIndex, inputs[0])

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
    }
  }, [uiRef, currentDisplayMode, currentPageIndex, selectedBootcampIndex, saltData]);

  const updateSaltDataHandler = (data: SaltData) => {
    if (saltData) {
      setSaltData(prevSaltInfoProper =>
        (prevSaltInfoProper ?? []).map((item, index) =>
          index === selectedBootcampIndex
            ? { ...item, students: data.students, template: data.template }
            : item
        )
      );
    }
  
    setCurrentPageIndex(0);
  };

  const handleToggle = (checked: boolean) => {
    setDisplayMode(checked ? "form" : "viewer");
  };

  const prevTemplateInstanceHandler = () => {
    if (saltData) {
      setCurrentPageIndex((prevIndex) =>
        prevIndex === 0 ? saltData[selectedBootcampIndex].students.length - 1 : prevIndex - 1
      );
    }
  };

  const nextTemplateInstanceHandler = () => {
    if (saltData) {
      setCurrentPageIndex((prevIndex) =>
        prevIndex === saltData[selectedBootcampIndex].students.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const generatePDFHandler = async () => {
    if (uiInstance.current && saltData) {
      const inputs = uiInstance.current.getInputs();
      const pdfInput = makeTemplateInput(
          inputs[0].header,
          inputs[0].main,
          inputs[0].footer,
          inputs[0].pdfbase
      )
      const template = mapTemplateInputsToTemplateViewer(saltData, selectedBootcampIndex, pdfInput)
     
      await generatePDF(template, inputs);
      await postSelectedBootcampData();
    }
  };

  const generateCombinedPDFHandler = async () => {
    if (saltData) {
      const selectedBootcampData = saltData[selectedBootcampIndex];
      const inputsArray = selectedBootcampData.students.map((student) => {
        return templateInputsFromBootcampData(selectedBootcampData, student.name);
      });

      var templatesArr: Template[] = [];
      for (let i = 0; i < inputsArray.length; i++) {
        templatesArr.push(
          mapTemplateInputsToTemplateViewer(saltData, selectedBootcampIndex, inputsArray[i])
        )
      }

      await newGenerateCombinedPDF(templatesArr, inputsArray);
      await postSelectedBootcampData();
    }
  };

  const postSelectedBootcampData = async () => {
    if (saltData && bootcamps) {
      const currentBootcamp = bootcamps[selectedBootcampIndex];
      const studentsRequest: StudentsRequestDto = {
        students: saltData[selectedBootcampIndex].students.map((student, index) => ({
          guidId: currentBootcamp.students[index]?.guidId || crypto.randomUUID(),
          name: student.name,
          email: student.email,    
        })),
        bootcampGuidId: currentBootcamp.guidId
      };
      try {
        await addMultipleStudents(studentsRequest);
        customAlert(PopupType.success, "Diplomas added successfully.", "Successfully added diplomas to the database.");

      } catch (error) {
        customAlert(PopupType.fail, "Failed to add diplomas:", `${error}`);
      }
    }
  };

  const saveInputFieldsHandler = () => {
    if (uiInstance.current && saltData) {
      const inputs = uiInstance.current.getInputs();
      const newName = inputs[0].name;
      const currentName = saltData[selectedBootcampIndex].students[currentPageIndex].name;

      if (currentName === newName) {
        return;
      }

      const updatedSaltData = saltData.map((item, index) => {
        if (index === selectedBootcampIndex) {
          const updatedStudents = [...item.students];
          updatedStudents[currentPageIndex].name = newName;
          return { ...item, students: updatedStudents };
        }
        return item;
      });

      setSaltData(updatedSaltData);
    }
  };

  return (
    <div className="flex w-full h-screen justify-between pt-10 dark:bg-darkbg">
      <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert} durationOverride={3500} />
      <section className="flex-1 flex flex-col justify-start gap-1 ml-5" style={{ position: 'relative' }}>
        <header className="flex items-center justify-start gap-3 mb-5 viewersidebar-container">
          <div>
            <SwitchComponent
              checked={currentDisplayMode === "form"}
              onToggle={handleToggle}
            />
          </div>
          <PublishButton text="Generate PDF" onClick={generatePDFHandler} />
          <PublishButton text="Generate PDFs" onClick={generateCombinedPDFHandler} />
          <SaveButton textfield="" saveButtonType={SaveButtonType.grandTheftAuto} onClick={saveInputFieldsHandler} />
        </header>
        {saltData &&
          <div
            className="pdfpreview-container"
            ref={uiRef}
            style={{ width: "100%", height: "calc(82vh - 68px)" }}
          // onBlur={saveInputFieldsHandler}
          />
        }
        {saltData &&
          <PaginationMenu
            containerClassOverride="flex justify-center mt-4 pagination-menu"
            currentPage={currentPageIndex + 1}
            totalPages={saltData[selectedBootcampIndex].students.length}
            handleNextPage={nextTemplateInstanceHandler}
            handlePrevPage={prevTemplateInstanceHandler}
          />
        }
      </section>
      <section className="flex-1 flex flex-col ">
        {saltData &&
          <DiplomaDataForm
            updateSaltData={updateSaltDataHandler}
            bootcamps={bootcamps}
            setSelectedBootcampIndex={(index) => { setSelectedBootcampIndex(index); setCurrentPageIndex(0); }}
            selectedBootcampIndex={selectedBootcampIndex}
            saltData={saltData[selectedBootcampIndex]}
            templates={templates}
          />
        }
      </section>
    </div>
  );
}
