import { useEffect, useRef, useState } from "react";
import { Form, Viewer } from "@pdfme/ui";
import { BootcampResponse, StudentResponse, SaltData, displayMode, TemplateResponse, FormDataUpdateRequest } from "../../util/types";
import {
  getFontsData,
  getPlugins,
  generatePDF,
  newGenerateCombinedPDF,
  mapBootcampToSaltData,
  generateVerificationCode,
} from "../../util/helper";
import DiplomaDataForm from "../../feature/DiplomaDataForm";
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
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { useLoadingMessage } from "../../components/Contexts/LoadingMessageContext";
import { Popup404 } from "../../components/MenuItems/Popups/Popup404";
import { UpdateBootcampWithNewFormdata } from "../../services/bootcampService";
import { ErrorIcon } from "../../components/MenuItems/Icons/ErrorIcon";
import PreviewDiploma from "../../feature/PreviewDiploma";

type Props = {
  bootcamps: BootcampResponse[] | null;
  templates: TemplateResponse[] | null;
  UpdateBootcampWithNewFormdata: (updateFormDataRequest: FormDataUpdateRequest, guidid: string) => void
};

export default function DiplomaMaking({ bootcamps, templates, UpdateBootcampWithNewFormdata }: Props) {
  
  const [saltData, setSaltData] = useState<SaltData[] | null>();
  const [selectedBootcampIndex, setSelectedBootcampIndex] = useState<number>(0); // -> these 2 can be refactored into 1 state
  const { selectedBootcamp } = useParams<{ selectedBootcamp: string }>();
  const { showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
  const { loadingMessage } = useLoadingMessage();
  const isFailed = loadingMessage.includes('Failed');

  // When page starts -> Puts backend data into saltData
  useEffect(() => {
    if (bootcamps && templates) {
      if (selectedBootcamp) {
        setSelectedBootcampIndex(Number(selectedBootcamp));
      }
      if (bootcamps[selectedBootcampIndex].students.length === 0) {
        setSaltData([saltDefaultData]);
      }
      else {
        setSaltData(bootcamps.map(b => mapBootcampToSaltData(b, templates.find(t => t.id === b.templateId))));
      }
    }
  }, [bootcamps, templates]);

  const updateSaltDataHandler = (data: SaltData, ) => {
    if (saltData) {
      setSaltData(prevSaltInfoProper =>
        (prevSaltInfoProper ?? []).map((item, index) =>
          index === selectedBootcampIndex
            ? { ...item, students: data.students, template: data.template }
            : item
        )
      );
    }
  };

  const updateSaltNameForBootcamp = (name : string ) => {
    if (saltData) {
      setSaltData(prevSaltInfoProper =>
        (prevSaltInfoProper ?? []).map((item, index) =>
          index === selectedBootcampIndex
            ? { ...item, name: name }
            : item
        )
      );
    }
  };
  
   const postSelectedBootcampData = async (saltData: SaltData) => {
    const updateFormDataRequest: FormDataUpdateRequest = {
      students: saltData.students.map((student) => ({
        guidId: saltData?.guidId || crypto.randomUUID(),
        name: student.name,
        email: student.email,
        verificationCode: student.verificationCode
      })),
      templateId: saltData.template.id
    };

    try {
      await UpdateBootcampWithNewFormdata(updateFormDataRequest, saltData.guidId);
      customAlert('success', "Diplomas added successfully.", "Successfully added diplomas to the database.");

    } catch (error) {
      customAlert('fail', "Failed to add diplomas:", `${error}`);
      }
      } 
     

  return (
    <div className="flex w-full h-screen justify-between pt-10 dark:bg-darkbg">
      {saltData && templates ?
        <>
          <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert} durationOverride={3500} />
          <section className="flex-1 flex flex-col justify-start gap-1 ml-5" style={{ position: 'relative' }}>
            {saltData[selectedBootcampIndex].students.length > 0 ?
              (<PreviewDiploma 
                saltData={saltData[selectedBootcampIndex]}
                updateSaltNameForbootcamp={updateSaltNameForBootcamp}
                selectedBootcampIndex={selectedBootcampIndex}
                postSelectedBootcampData={postSelectedBootcampData}
              />) :
              (<Popup404 text="No student names found." />)}
          </section>
          <section className="flex-1 flex flex-col ">
            <DiplomaDataForm
              updateSaltData={updateSaltDataHandler}
              bootcamps={bootcamps}
              setSelectedBootcampIndex={(index) => { setSelectedBootcampIndex(index); }}
              selectedBootcampIndex={selectedBootcampIndex}
              saltData={saltData[selectedBootcampIndex]}
              templates={templates}
            />
          </section>
        </>
        :
        <>
          <h1 className="loading-title">{loadingMessage}</h1>
          {!isFailed ?
            <SpinnerDefault classOverride="spinner-diplomamaking" />
            :
            <div className="loading-error__icon">
              <ErrorIcon />
            </div>
          }

        </>
      }
    </div>
  );
};
