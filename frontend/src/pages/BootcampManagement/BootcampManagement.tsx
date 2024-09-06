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

export type SortOrder =
  'bootcampname-ascending' | 'bootcampname-descending' |
  'graduationdate-ascending' | 'graduationdate-descending' |
  'track-ascending' | 'track-descending';

export default function BootcampManagement({ deleteBootcamp, addNewBootcamp, updateBootcamp, tracks }: Props) {
  const [bootcamps, setBootcamps] = useState<BootcampResponse[] | null>(null);
  const [filteredBootcamps, setFilteredBootcamps] = useState<BootcampResponse[] | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1920 ? 5 : 11);
  const [sortOrder, setSortOrder] = useState<SortOrder>('graduationdate-descending');
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

  const sortedBootcamps = filteredBootcamps?.sort((a, b) => {
    switch (sortOrder) {
      case 'bootcampname-ascending':
        return a.name.localeCompare(b.name);
      case 'bootcampname-descending':
        return b.name.localeCompare(a.name);
      case 'graduationdate-ascending':
        return new Date(a.graduationDate).getTime() - new Date(b.graduationDate).getTime();
      case 'graduationdate-descending':
        return new Date(b.graduationDate).getTime() - new Date(a.graduationDate).getTime();
      case 'track-ascending':
        return a.track?.name.localeCompare(b.track?.name);
      case 'track-descending':
        return b.track?.name.localeCompare(a.track?.name);
      default:
        return 0;
    }
  });

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

  const paginatedBootcamps = sortedBootcamps?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (paginatedBootcamps) {
      const formValues = paginatedBootcamps.reduce((acc, bootcamp, index) => {
        const actualIndex = (currentPage - 1) * itemsPerPage + index;
        acc[`name${actualIndex}`] = bootcamp.name;
        acc[`dategraduate${actualIndex}`] = utcFormatterSlash(bootcamp.graduationDate);
        acc[`track${actualIndex}`] = bootcamp.track.id.toString();
        return acc;
      }, {});
      reset(formValues);
    }
  }, [sortingChanged, filteredBootcamps]);

  const handleSortChange = (sortType: SortOrder) => {
    setSortOrder(prevOrder => {
      if (prevOrder.startsWith(sortType.split('-')[0])) {
        return prevOrder === sortType ? `${sortType.split('-')[0]}-ascending` as SortOrder : sortType;
      } else {
        return sortType;
      }
    });
    setSortingChanged(prev => !prev);
  };

  const handleDeleteBootcamp = async (i: number) => {
    closeConfirmationPopup();
    customAlert('loading', "Deleting Bootcamp...", ``);
    await deleteBootcamp(i);
    customAlert('message', "Delete Successful", `Successfully removed bootcamp from database.`);
    setSortingChanged(prev => !prev);
  }

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
  const confirmDeleteBootcampHandler = async (index: number) => customPopup('warning2', "Warning", <>By deleting this, you will lose <b style={{ color: '#EF4444' }}>ALL OF THE DIPLOMAS</b> associated with this bootcamp. This action cannot be undone.</>, () => () => handleDeleteBootcamp(index));

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
                tracks={tracks}
                bootcamps={bootcamps}
                paginatedBootcamps={paginatedBootcamps}
                filteredBootcamps={filteredBootcamps}
                sortOrder={sortOrder}
                handleSortChange={handleSortChange}
                confirmDeleteBootcampHandler={confirmDeleteBootcampHandler}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setSortingChanged={setSortingChanged}
                calendarPickers={calendarPickers}
                register={register}
                setValue={setValue}
                watch={watch}
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