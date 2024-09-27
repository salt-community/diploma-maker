import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { BootcampRequest, BootcampResponse, TrackResponse } from "../../../util/types";
import AddNewBootcampForm from "../../Forms/AddNewBootcampForm";
import { PopupType } from "../../MenuItems/Popups/AlertPopup";
import { ConfirmationPopupType } from "../../MenuItems/Popups/ConfirmationPopup";
import { BootcampsSectionFooter } from "./BootcampsSectionFooter";
import { BootcampsTable } from "./BootcampsTable";
import { useEffect, useRef, useState } from "react";

type Props = {
  tracks: TrackResponse[];
  bootcamps: BootcampResponse[];
  filteredBootcamps: BootcampResponse[] | null;
  setFilteredBootcamps: (value: React.SetStateAction<BootcampResponse[]>) => void;
  deleteBootcamp: (guidId: string) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  updateBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  closeConfirmationPopup: () => void;
  customAlert: (alertType: PopupType, title: string, content: string) => void;
  customPopup: (type: ConfirmationPopupType, title: string, content: React.ReactNode, handler: () => void) => void
}


export const BootcampsManageForm = ({ 
  tracks,
  bootcamps, 
  filteredBootcamps, 
  setFilteredBootcamps,
  deleteBootcamp,
  addNewBootcamp,
  updateBootcamp,
  closeConfirmationPopup,
  customAlert,
  customPopup,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingChanged, setSortingChanged] = useState(false);
  const [prevBootcamps, setPrevBootcamps] = useState<BootcampResponse[]>();

  const calendarPickers = useRef([]);
  const { register, handleSubmit, setValue, watch, reset } = useForm();

  useEffect(() => {
    if(bootcamps){
      setPrevBootcamps(bootcamps);
    }
  }, [bootcamps])

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
        const inputDate = data[`dategraduate${i}` as keyof typeof data];

        const prevDate = new Date(prevBootcamps[i].graduationDate).toISOString().split('T')[0];
        const matchingBootcamp = (prevDate === inputDate) || inputDate === undefined;

          if (!matchingBootcamp) {
            try {
              const newBootcamp: BootcampRequest = {
                guidId: bootcamps![i].guidId,
                name: data[`name${i}`],
                graduationDate: new Date(data[`dategraduate${i}`]),
                trackId: parseInt(data[`track${i}`])
              };
              
              await updateBootcamp(newBootcamp);
              customAlert('success', "Updated Bootcamps Successfully.", `Successfully updated bootcamp in the database.`);
              setSortingChanged(prev => !prev);
            } catch (error) {
              customAlert('fail', "Error Updating Bootcamp", `${error}`);
            }
          }
      }
  }

  const confirmChangeBootcampHandler = async (data: FieldValues) => customPopup('question2', "Are you sure you want to change existing bootcamps?", "This can be destructive if you've already generated diplomas with that bootcamp.", () => () => handleUpdateBootcamp(data));

  return (
    <form onSubmit={handleSubmit(confirmChangeBootcampHandler)}>
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-body">
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
  );
};