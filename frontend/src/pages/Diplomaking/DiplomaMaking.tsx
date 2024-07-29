import { useEffect, useState } from "react";
import { BootcampResponse,  SaltData, TemplateResponse, FormDataUpdateRequest, TrackResponse } from "../../util/types";
import {
  mapBootcampToSaltData,
} from "../../util/helper";
import DiplomaDataForm from "../../feature/Diplomadataform/DiplomaDataForm";
import './DiplomaMaking.css';
import { AlertPopup, PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import { useCustomAlert } from "../../components/Hooks/useCustomAlert";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { useLoadingMessage } from "../../components/Contexts/LoadingMessageContext";
import { Popup404 } from "../../components/MenuItems/Popups/Popup404";
import { ErrorIcon } from "../../components/MenuItems/Icons/ErrorIcon";
import PreviewDiploma from "../../feature/PreviewDiploma";
import { NextIcon } from "../../components/MenuItems/Icons/NextIcon";

type Props = {
  tracks: TrackResponse[] | null;
  bootcamps: BootcampResponse[] | null;
  templates: TemplateResponse[] | null;
  UpdateBootcampWithNewFormdata: (updateFormDataRequest: FormDataUpdateRequest, guidid: string) => void
};

export default function DiplomaMaking({ tracks, bootcamps, templates, UpdateBootcampWithNewFormdata }: Props) {

 /*  const [IsFullScreen, setIsFullScreen] = useState<boolean>(true) */
  // current data selected 
  const [saltData, setSaltData] = useState<SaltData[] | null>();
  const [selectedBootcampIndex, setSelectedBootcampIndex] = useState<number>(0); // -> these 2 can be refactored into 1 state
  const { showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
  const { loadingMessage } = useLoadingMessage();
  const isFailed = loadingMessage.includes('Failed');


  // When page starts -> Puts backend data into saltData
  useEffect(() => {
    if (bootcamps && templates) {
        setSaltData(bootcamps.map(b => mapBootcampToSaltData(b, templates.find(t => t.id === b.templateId))));
      }
  }, [bootcamps, templates]);


  /* update saltdata with new student and template */
  const updateSaltDataHandler = (data: SaltData) => {
      setSaltData(prevSaltInfoProper =>
        (prevSaltInfoProper ?? []).map((item) =>
         item.guidId == data.guidId
            ? { ...item, students: data.students, template: data.template }
            : item
        )
      );
  };

/*   const TogglePreview = () => setIsFullScreen(prev => !prev) */

  return (
    saltData && templates ? (
      <div className={`flex w-full h-screen pt-10 dark:bg-darkbg`}>
{/*        {  <button className="toggle-button" onClick={TogglePreview}>
          {IsFullScreen ? <NextIcon rotation={180} /> : <NextIcon />}
        </button> } */}
        <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert} durationOverride={3500} />
           <>
            <section className="flex-1 flex flex-col justify-start gap-1 ml-5">
              {saltData[selectedBootcampIndex].students.length > 0 ? (
                <PreviewDiploma
                  saltData={saltData[selectedBootcampIndex]}
                />
              ) : (
                <Popup404 text="No student names found." />
              )}
            </section>
            <section className="flex-1 flex flex-col">
              <DiplomaDataForm
                UpdateBootcampWithNewFormdata={UpdateBootcampWithNewFormdata}
                updateSaltData={updateSaltDataHandler}
                bootcamps={bootcamps}
                setSelectedBootcampIndex={(index) => { setSelectedBootcampIndex(index); }}
                selectedBootcampIndex={selectedBootcampIndex}
                saltData={saltData[selectedBootcampIndex]}
                templates={templates}
               /*  fullscreen={IsFullScreen} */
                customAlert={customAlert}
              />
            </section>
          </>
      
      </div>
    ) : (
      <>
        <h1 className="loading-title">{loadingMessage}</h1>
        {!isFailed ? (
          <SpinnerDefault classOverride="spinner-diplomamaking" />
        ) : (
          <div className="loading-error__icon">
            <ErrorIcon />
          </div>
        )}
      </>
    )
  )

};
