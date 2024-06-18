import { useEffect, useRef, useState } from "react";
import { Template } from "@pdfme/common";
import { getTemplate, makeTemplateInput } from "../templates/baseTemplate";
import { Form, Viewer } from "@pdfme/ui";
import { BootcampResponse, DiplomaResponse, DiplomasRequestDto, SaltData, displayMode } from "../util/types";
import {
  getFontsData,
  getPlugins,
  generatePDF,
  generateCombinedPDF,
  populateIntroField,
  populateNameField,
  populateFooterField,
} from "../util/helper";
import AddDiplomaForm from "../components/AddDiplomaForm";
import { useParams } from "react-router-dom";
import { PaginationMenu } from "../components/MenuItems/PaginationMenu";
import { PublishButton } from "../components/MenuItems/Buttons/PublishButton";
import './DiplomaMaking.css'
import { SwitchComponent } from "../components/MenuItems/Inputs/SwitchComponent";
import { SaveButton } from "../components/MenuItems/Buttons/SaveButton";
import { AlertPopup, PopupType } from "../components/MenuItems/Popups/AlertPopup";
import { saltDefaultData } from "../data/data";

type Props = {
  bootcamps: BootcampResponse[] | null;
  addMultipleDiplomas: (diplomasRequest: DiplomasRequestDto) => Promise<DiplomaResponse[]>;
};

export default function DiplomaMaking({ bootcamps, addMultipleDiplomas }: Props) {
  const [saltData, setSaltData] = useState<SaltData[] | null>()
  const [currentDisplayMode, setDisplayMode] = useState<displayMode>("form");
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [selectedBootcampIndex, setSelectedBootcampIndex] = useState<number>(0);

  const uiRef = useRef<HTMLDivElement | null>(null);
  const uiInstance = useRef<Form | Viewer | null>(null);

  const { selectedBootcamp } = useParams<{ selectedBootcamp: string }>();

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupContent, setPopupContent] = useState<string[]>(["",""]);
  const [popupType, setPopupType] = useState<PopupType>(PopupType.success);

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
              template: bootcamp.template
            };
          } else {
            return {
              classname: bootcamp.name,
              dategraduate: bootcamp.graduationDate.toString().slice(0, 10),
              names: bootcamp.diplomas.map((diploma) => diploma.studentName),
              template: bootcamp.template
            };
          }
        });
        setSaltData(initialSaltData)
      }
    }
  }, [bootcamps]);

  // When Page Changes -> Loads into PDF preview
  useEffect(() => {
    if(saltData){
      const inputs = 
        [makeTemplateInput(
          populateIntroField(
            saltData[selectedBootcampIndex].template.intro
          ),
          populateNameField(
            saltData[selectedBootcampIndex].template.studentName,
            saltData[selectedBootcampIndex].names[currentPageIndex]
          ),
          populateFooterField(
            saltData[selectedBootcampIndex].template.footer,
            saltData[selectedBootcampIndex].classname,
            saltData[selectedBootcampIndex].dategraduate
          ),
          saltData[selectedBootcampIndex].template.basePdf
        )];
      const template: Template = getTemplate(inputs[0]);

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
    if(saltData){
      setSaltData(prevSaltInfoProper =>
        (prevSaltInfoProper ?? []).map((item, index) =>
          index === selectedBootcampIndex
            ? { ...item, names: data.names }
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
    if(saltData){
      setCurrentPageIndex((prevIndex) =>
        prevIndex === 0 ? saltData[selectedBootcampIndex].names.length - 1 : prevIndex - 1
      );
    }
  };

  const nextTemplateInstanceHandler = () => {
    if(saltData){
      setCurrentPageIndex((prevIndex) =>
        prevIndex === saltData[selectedBootcampIndex].names.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const generatePDFHandler = async () => {
    if (uiInstance.current) {
      const inputs = uiInstance.current.getInputs();
      const template = getTemplate();
      await generatePDF(template, inputs);
      await postSelectedBootcampData();
    }
  };

  const generateCombinedPDFHandler = async () => {
      if (saltData) {
          const inputsArray = saltData[selectedBootcampIndex].names.map((_, index) => {
              return [makeTemplateInput(saltData[selectedBootcampIndex].names[index], saltData[selectedBootcampIndex].classname, saltData[selectedBootcampIndex].dategraduate)];
          });

          await generateCombinedPDF(saltData[selectedBootcampIndex].names.map(() => getTemplate()), inputsArray);
          await postSelectedBootcampData();
      }
  };

  const postSelectedBootcampData = async () => {
    if (saltData && bootcamps) {
      const currentBootcamp = bootcamps[selectedBootcampIndex];
      const diplomasRequest: DiplomasRequestDto = {
          diplomas: saltData[selectedBootcampIndex].names.map((name, index) => ({
              guidId: currentBootcamp.diplomas[index]?.guidId || crypto.randomUUID(),
              studentName: name,
              bootcampGuidId: currentBootcamp.guidId
          }))
      };
      try {
          await addMultipleDiplomas(diplomasRequest);

          setPopupType(PopupType.success);
          setPopupContent(["Diplomas added successfully.", "Successfully added diplomas to the database."]);
          setShowPopup(true);

      } catch (error) {
          setPopupType(PopupType.fail);
          setPopupContent(["Failed to add diplomas:", `${error}`]);
          setShowPopup(true);
      }
    }
  }


  const saveInputFieldsHandler = () => {
    if (uiInstance.current && saltData) {
      const inputs = uiInstance.current.getInputs();
      const newName = inputs[0].name;
      const currentName = saltData[selectedBootcampIndex].names[currentPageIndex];

      if (currentName === newName) {
        return;
      }

      const updatedSaltData = saltData.map((item, index) => {
        if (index === selectedBootcampIndex) {
          const updatedNames = [...item.names];
          updatedNames[currentPageIndex] = newName;
          return { ...item, names: updatedNames };
        }
        return item;
      });
  
      setSaltData(updatedSaltData);
    }
  };

  return (
    <div className="flex w-full h-screen justify-between pt-10 dark:bg-darkbg">
      <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={() => setShowPopup(false)} durationOverride={3500}/>
      <section className="flex-1 flex flex-col justify-start gap-1 ml-5" style={{position: 'relative'}}>
        <header className="flex items-center justify-start gap-3 mb-5 viewersidebar-container">
          <div>
            <SwitchComponent
              checked={currentDisplayMode === "form"}
              onToggle={handleToggle}
            />
          </div>
          <PublishButton text="Generate PDF" onClick={generatePDFHandler}/>
          <PublishButton text="Generate PDFs" onClick={generateCombinedPDFHandler}/>
          <SaveButton onClick={saveInputFieldsHandler}/>
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
            totalPages={saltData[selectedBootcampIndex].names.length} 
            handleNextPage={nextTemplateInstanceHandler} 
            handlePrevPage={prevTemplateInstanceHandler}
          />
        }
      </section>
      <section className="flex-1 flex flex-col">
        {saltData &&
          <AddDiplomaForm 
            updateSaltData={updateSaltDataHandler} 
            bootcamps={bootcamps} 
            setSelectedBootcampIndex={(index) => {setSelectedBootcampIndex(index); setCurrentPageIndex(0);}}
            saltData={saltData[selectedBootcampIndex]}
          />
        }
      </section>
    </div>
  );
}