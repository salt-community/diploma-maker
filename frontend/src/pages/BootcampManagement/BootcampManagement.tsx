import './BootcampManagement.css'
import { FieldValues, useForm } from "react-hook-form";
import { BootcampsTable } from "../../components/Feature/BootcampManage/BootcampsTable";
import AddNewBootcampForm from "../../components/Forms/AddNewBootcampForm";
import { PaginationMenu } from "../../components/MenuItems/PaginationMenu";
import { AlertPopup } from "../../components/MenuItems/Popups/AlertPopup";
import { ConfirmationPopup } from "../../components/MenuItems/Popups/ConfirmationPopup";
import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types";
import { useEffect, useRef, useState } from "react";
import { utcFormatterSlash } from "../../util/datesUtil";
import { useCustomAlert } from "../../components/Hooks/useCustomAlert";
import { useCustomConfirmationPopup } from "../../components/Hooks/useCustomConfirmationPopup";
import { BootcampsSectionHeader } from '../../components/Feature/BootcampManage/BootcampsSectionHeader';
import { BootcampsSectionFooter } from '../../components/Feature/BootcampManage/BootcampsSectionFooter';

type Props = {
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  updateBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  tracks: TrackResponse[];
}

export default function BootcampManagement({ deleteBootcamp, addNewBootcamp, updateBootcamp, tracks }: Props) {
  const [bootcamps, setBootcamps] = useState<BootcampResponse[] | null>(null);
  const [filteredBootcamps, setFilteredBootcamps] = useState<BootcampResponse[] | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortingChanged, setSortingChanged] = useState(false);


  const calendarPickers = useRef([]);
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const { showConfirmationPopup, confirmationPopupContent, confirmationPopupType, confirmationPopupHandler, customPopup, closeConfirmationPopup } = useCustomConfirmationPopup();
  const { showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();

  useEffect(() => {
    if(tracks){
      const bootcampsArr = tracks.flatMap(t => t.bootcamps.map(b => ({...b, track: t})));
      setBootcamps(bootcampsArr)
      setFilteredBootcamps(bootcampsArr);
    }
  }, [tracks])

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedTrackId = e.target.value;
      setCurrentPage(1);
      if (selectedTrackId === "") {
          setFilteredBootcamps(bootcamps);
      } else {
          setFilteredBootcamps(bootcamps?.filter(b => b.track.id.toString() === selectedTrackId) || null);
      }
      setSortingChanged(prev => !prev);
  };

  const addNewBootcampHandler = async (bootcamp: BootcampRequest) => {
      customAlert('loading', "Adding New Bootcamp...", ``);
      try {
          await addNewBootcamp(bootcamp)
          customAlert('success', "Added Bootcamp Successfully.", `Successfully added bootcamp to the database.`);
      } catch (error) {
          customAlert('fail', "Error Adding Bootcamp", `${error}`);
      }
  }

  const handleUpdateBootcamp = async (data: FieldValues) => {
      closeConfirmationPopup();

      customAlert('loading', "Updating Bootcamp...", ``);
      for (let i = 0; i < bootcamps!.length; i++) {
          const newBootcamp: BootcampRequest = {
          guidId: bootcamps![i].guidId,
          name: data[`name${i}`],
          graduationDate: new Date(data[`dategraduate${i}`]),
          trackId: parseInt(data[`track${i}`])
          };

          try {
          await updateBootcamp(newBootcamp);
          customAlert('success', "Updated Bootcamps Successfully.", `Successfully updated bootcamp in the database.`);
          setSortingChanged(prev => !prev);
          } catch (error) {
          customAlert('fail', "Error Updating Bootcamp", `${error}`);
          }
      }
  }

  const confirmChangeBootcampHandler = async (data: FieldValues) => customPopup('question2', "Are you sure you want to change existing bootcamps?", "This can be destructive if you've already generated diplomas with that bootcamp.", () => () => handleUpdateBootcamp(data));

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
      <form onSubmit={handleSubmit(confirmChangeBootcampHandler)}>
        <div className="modal-container">
          <div className="modal-content">
            <div className="modal-body">
              <BootcampsSectionHeader 
                bootcamps={bootcamps}
                title={'Bootcamps'}
                handleTrackChange={handleTrackChange}
              />
              <BootcampsTable 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                sortingChanged={sortingChanged}
                setSortingChanged={setSortingChanged}
                tracks={tracks}
                bootcamps={bootcamps}
                filteredBootcamps={filteredBootcamps}
                setFilteredBootcamps={setFilteredBootcamps}
                deleteBootcamp={deleteBootcamp}
                calendarPickers={calendarPickers}
                closeConfirmationPopup={closeConfirmationPopup}
                customAlert={customAlert}
                customPopup={customPopup}
                register={register}
                setValue={setValue}
                watch={watch}
                reset={reset}
              />
              <AddNewBootcampForm addNewBootcamp={addNewBootcampHandler} bootcamps={bootcamps} tracks={tracks} />
              <BootcampsSectionFooter />
            </div>
          </div>
        </div>
        <div className="overlay-bg"></div>
      </form>
    </>
  );
}