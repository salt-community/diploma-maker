import { useEffect, useState } from "react";
import { BootcampResponse, SaltData, TemplateResponse, FormDataUpdateRequest, TrackResponse, StudentResponse, Student } from "../../util/types";
import {
  mapBootcampToSaltData,
} from "../../util/helper";
import DiplomaDataForm from "../../components/Feature/Diplomadataform/DiplomaDataForm";
import './DiplomaMaking.css';
import { AlertPopup, CustomAlertPopupProps, PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import { useCustomAlert } from "../../components/Hooks/useCustomAlert";
import { SpinnerDefault } from "../../components/MenuItems/Loaders/SpinnerDefault";
import { useLoadingMessage } from "../../components/Contexts/LoadingMessageContext";
import { Popup404 } from "../../components/MenuItems/Popups/Popup404";
import { ErrorIcon } from "../../components/MenuItems/Icons/ErrorIcon";
import PreviewDiploma from "../../components/Feature/PreviewDiploma/PreviewDiploma";
/* import { NextIcon } from "../../components/MenuItems/Icons/NextIcon"; */

type Props = {
  tracks: TrackResponse[] | null;
  templates: TemplateResponse[] | null;
  UpdateBootcampWithNewFormdata: (updateFormDataRequest: FormDataUpdateRequest, guidid: string) => Promise<BootcampResponse>
  setLoadingMessage: (message: string) => void;
  updateStudentThumbnails: (pdfs: Uint8Array[], studentsInput: Student[], setLoadingMessageAndAlert: (message: string) => void) => Promise<void>;
  customAlertProps: CustomAlertPopupProps;
};


export default function DiplomaMaking({ tracks, templates, UpdateBootcampWithNewFormdata, setLoadingMessage, updateStudentThumbnails, customAlertProps }: Props) {

  /*  const [IsFullScreen, setIsFullScreen] = useState<boolean>(true) */
  const [saltData, setSaltData] = useState<SaltData | null>();
  const { loadingMessage } = useLoadingMessage();
  const isFailed = loadingMessage.includes('Failed');
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number |null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  const handleIndexChange = (index: number) => {
    setSelectedStudentIndex(index);
  };
  /*   const TogglePreview = () => setIsFullScreen(prev => !prev) */

  return (
    tracks && templates ? (
      <div className={'diplomamaking-container'}>
        {/*        {  <button className="toggle-button" onClick={TogglePreview}>
          {IsFullScreen ? <NextIcon rotation={180} /> : <NextIcon />}
        </button> } */}
        <>
          <section className="previewdiploma-container">
            {saltData && (
              <>
                <h1 className="text-lg font-medium text-gray-700 dark:text-white mb-2 text-center chosen__bootcamp">
                  Currently selected: {saltData.classname}
                </h1>
                {saltData.students.length > 0 ? (
                  <PreviewDiploma setSelectedStudentIndex={handleIndexChange} saltData={saltData} currentPageIndex={currentPageIndex} setCurrentPageIndex={setCurrentPageIndex}/>
                ) : (
                  <div className="popup404-wrapper">
                    <Popup404 text="No student names found." />
                  </div>
                )}
              </>
            )}
          </section>
          <section className="diplomadataform-container">
            <DiplomaDataForm
              selectedStudentIndex={selectedStudentIndex}
              setSelectedStudentIndex={(idx: number) => {handleIndexChange(idx); setCurrentPageIndex(idx);}}
              setSaltData={setSaltData}
              tracks={tracks}
              UpdateBootcampWithNewFormdata={UpdateBootcampWithNewFormdata}
              templates={templates}
              updateStudentThumbnails={updateStudentThumbnails}
              customAlertProps={customAlertProps}
              setLoadingMessage={setLoadingMessage}
            /*  fullscreen={IsFullScreen} */
            />
          </section>
          <div className="far-right-space"></div>
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