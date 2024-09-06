import './BootcampManagement.css'
import { AlertPopup } from "../../components/MenuItems/Popups/AlertPopup";
import { ConfirmationPopup } from "../../components/MenuItems/Popups/ConfirmationPopup";
import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types";
import { useEffect, useState } from "react";
import { useCustomAlert } from "../../components/Hooks/useCustomAlert";
import { useCustomConfirmationPopup } from "../../components/Hooks/useCustomConfirmationPopup";
import { BootcampsManageForm } from '../../components/Feature/BootcampManage/BootcampsManageForm';

type Props = {
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  updateBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  tracks: TrackResponse[];
}

export default function BootcampManagement({ deleteBootcamp, addNewBootcamp, updateBootcamp, tracks }: Props) {
  const [bootcamps, setBootcamps] = useState<BootcampResponse[] | null>(null);
  const [filteredBootcamps, setFilteredBootcamps] = useState<BootcampResponse[] | null>(null);

  const { showConfirmationPopup, confirmationPopupContent, confirmationPopupType, confirmationPopupHandler, customPopup, closeConfirmationPopup } = useCustomConfirmationPopup();
  const { showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();

  useEffect(() => {
    if(tracks){
      const bootcampsArr = tracks.flatMap(t => t.bootcamps.map(b => ({...b, track: t})));
      setBootcamps(bootcampsArr)
      setFilteredBootcamps(bootcampsArr);
    }
  }, [tracks])

  return (
    <>
      <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert} />
      <ConfirmationPopup
        title={confirmationPopupContent[0]}
        text={confirmationPopupContent[1]}
        show={showConfirmationPopup}
        confirmationPopupType={confirmationPopupType}
        abortClick={closeConfirmationPopup}
        // @ts-ignore
        confirmClick={(inputContent?: string) => { confirmationPopupHandler(inputContent) }}
      />
      <BootcampsManageForm 
        tracks={tracks}
        bootcamps={bootcamps}
        filteredBootcamps={filteredBootcamps}
        setFilteredBootcamps={setFilteredBootcamps}
        deleteBootcamp={deleteBootcamp}
        addNewBootcamp={addNewBootcamp}
        updateBootcamp={updateBootcamp}
        closeConfirmationPopup={closeConfirmationPopup}
        customAlert={customAlert}
        customPopup={customPopup}
      />
    </>
  );
}