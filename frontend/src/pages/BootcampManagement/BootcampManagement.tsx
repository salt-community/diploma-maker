import { FieldValues, useForm, useWatch } from "react-hook-form";
import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types";
import { useEffect, useState } from "react";
import AddNewBootcampForm from "../../components/Forms/AddNewBootcampForm";
import { AlertPopup, PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import './BootcampManagement.css';
import { SelectOptions } from "../../components/MenuItems/Inputs/SelectOptions";
import { useCustomAlert } from "../../components/Hooks/useCustomAlert";
import { ArrowIcon } from '../../components/MenuItems/Icons/ArrowIcon';
import { useCustomConfirmationPopup } from "../../components/Hooks/useCustomConfirmationPopup";
import { utcFormatterSlash } from "../../util/helper";
import { ConfirmationPopup } from "../../components/MenuItems/Popups/ConfirmationPopup";
import { DeleteButtonSimple } from "../../components/MenuItems/Buttons/DeleteButtonSimple";
import { PaginationMenu } from "../../components/MenuItems/PaginationMenu";

type Props = {
  bootcamps: BootcampResponse[] | null;
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  updateBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  tracks: TrackResponse[];
}

type SortOrder =
  'bootcampname-ascending' | 'bootcampname-descending' |
  'graduationdate-ascending' | 'graduationdate-descending' |
  'track-ascending' | 'track-descending';

export default function BootcampManagement({ bootcamps, deleteBootcamp, addNewBootcamp, updateBootcamp, tracks }: Props) {
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const { showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
  const { showConfirmationPopup, confirmationPopupContent, confirmationPopupType, confirmationPopupHandler, customPopup, closeConfirmationPopup } = useCustomConfirmationPopup();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth < 1920 ? 5 : 11);
  const [sortOrder, setSortOrder] = useState<SortOrder>('graduationdate-descending');
  const [sortingChanged, setSortingChanged] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1920 ? 5 : 11);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const totalPages = Math.ceil(bootcamps?.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    setSortingChanged(prev => !prev);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    setSortingChanged(prev => !prev);
  };

  const sortedBootcamps = bootcamps?.sort((a, b) => {
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
        return a.track.name.localeCompare(b.track.name);
      case 'track-descending':
        return b.track.name.localeCompare(a.track.name);
      default:
        return 0;
    }
  });

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
  }, [sortingChanged]);

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
    await deleteBootcamp(i);
    customAlert('message', "Delete Successful", `Successfully removed bootcamp from database.`);
    setSortingChanged(prev => !prev);
  }

  const handleUpdateBootcamp = async (data: FieldValues) => {
    closeConfirmationPopup();
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

  const confirmChangeBootcampHandler = async (data: FieldValues) => {
    customPopup('question2', "Are you sure you want to change existing bootcamps?", "This can be destructive if you've already generated diplomas with that bootcamp.", () => () => handleUpdateBootcamp(data));
  };

  const confirmDeleteBootcampHandler = async (index: number) => {
    customPopup('warning2', "Warning", <>By deleting this, you will lose <b style={{ color: '#EF4444' }}>ALL OF THE DIPLOMAS</b> associated with this bootcamp. This action cannot be undone.</>, () => () => handleDeleteBootcamp(index));
  };

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
            {/*content*/}
            <div className="modal-body">
              {/*header*/}
              <div className="modal-header">
                <h3 className="modal-title">Bootcamp Management</h3>
              </div>
              {/*body*/}
              <div className="modal-main">
                <table className="table-auto">
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSortChange(sortOrder === 'bootcampname-descending' ? 'bootcampname-ascending' : 'bootcampname-descending')}
                        className={'sortable-header ' + (sortOrder.includes('bootcampname') ? (sortOrder === 'bootcampname-descending' ? 'descending' : 'ascending') : '')}
                      >
                        Bootcamp Name <div className={'icon-container ' + (!sortOrder.includes('bootcampname') ? 'hidden' : '')}><ArrowIcon rotation={sortOrder === 'bootcampname-descending' ? 180 : 0} /></div>
                      </th>
                      <th
                        onClick={() => handleSortChange(sortOrder === 'graduationdate-descending' ? 'graduationdate-ascending' : 'graduationdate-descending')}
                        className={'sortable-header ' + (sortOrder.includes('graduationdate') ? (sortOrder === 'graduationdate-descending' ? 'descending' : 'ascending') : '')}
                      >
                        Graduation Date <div className={'icon-container ' + (!sortOrder.includes('graduationdate') ? 'hidden' : '')}><ArrowIcon rotation={sortOrder === 'graduationdate-descending' ? 180 : 0} /></div>
                      </th>
                      <th
                        onClick={() => handleSortChange(sortOrder === 'track-descending' ? 'track-ascending' : 'track-descending')}
                        className={'sortable-header ' + (sortOrder.includes('track') ? (sortOrder === 'track-descending' ? 'descending' : 'ascending') : '')}
                      >
                        Track <div className={'icon-container ' + (!sortOrder.includes('track') ? 'hidden' : '')}><ArrowIcon rotation={sortOrder === 'track-descending' ? 180 : 0} /></div>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBootcamps &&
                      paginatedBootcamps.map((bootcamp, index) => {
                        const actualIndex = (currentPage - 1) * itemsPerPage + index;
                        return (
                          // Display existing bootcamps
                          <tr className="table-row" key={`tablecell_${bootcamp.guidId}`}>
                            <td className="table-cell">
                              <input
                                type="text"
                                {...register(`name${actualIndex}`)}
                                defaultValue={bootcamp.name}
                                className="date-input disabled"
                                disabled
                              />
                            </td>
                            <td className="table-cell">
                              <input
                                id={bootcamp.guidId + "1"}
                                {...register(`dategraduate${actualIndex}`)}
                                type="date"
                                className="date-input"
                                defaultValue={utcFormatterSlash(bootcamp.graduationDate)}
                                key={`dategrad_${bootcamp.guidId}`}
                              />
                            </td>
                            <td className="table-cell">
                              <SelectOptions
                                containerClassOverride='normal'
                                selectClassOverride='normal'
                                options={[
                                  ...(tracks?.map(track => ({
                                    value: track.id.toString(),
                                    label: track.name
                                  })) || [])
                                ]}
                                value={watch(`track${actualIndex}`, bootcamp.track.id.toString())}
                                onChange={(e) => {
                                  setValue(`track${actualIndex}`, e.target.value);
                                  bootcamp.track.id = parseInt(e.target.value);
                                }}
                                reactHookForm={true}
                                register={register}
                                name={`track${actualIndex}`}
                              />
                            </td>
                            <td>
                              <DeleteButtonSimple onClick={() => confirmDeleteBootcampHandler(actualIndex)} />
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
              <div className="modal-main-footer">
                <AddNewBootcampForm addNewBootcamp={addNewBootcamp} bootcamps={bootcamps} tracks={tracks} />
                {bootcamps && bootcamps.length > itemsPerPage && (
                  <PaginationMenu
                    containerClassOverride='modal-main-footer--pagination'
                    buttonClassOverride='pagination-button'
                    textContainerClassOverride='pagination-info'
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handleNextPage={handleNextPage}
                    handlePrevPage={handlePrevPage}
                  />
                )}
              </div>
              {/*footer*/}
              <div className="footer-container">
                <button
                  className="submit-button"
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="overlay-bg"></div>
      </form>
    </>
  );
}
