import { FieldValues, useForm, useWatch } from "react-hook-form";
import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types"
import { useEffect, useState } from "react";
import AddNewBootcampForm from "../../components/Forms/AddNewBootcampForm";
import { AlertPopup, PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import './BootcampManagement.css'
import { SelectOptions } from "../../components/MenuItems/Inputs/SelectOptions";
import { useCustomAlert } from "../../components/Hooks/useCustomAlert";
import { useCustomConfirmationPopup } from "../../components/Hooks/useCustomConfirmationPopup";
import { ConfirmationPopup } from "../../components/MenuItems/Popups/ConfirmationPopup";
import { DeleteButtonSimple } from "../../components/MenuItems/Buttons/DeleteButtonSimple";
import { PaginationMenu } from "../../components/MenuItems/PaginationMenu";
import { utcFormatterSlash } from "../../util/helper";

type Props = {
  bootcamps: BootcampResponse[] | null;
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  updateBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  tracks: TrackResponse[];
}

export default function BootcampManagement({ bootcamps, deleteBootcamp, addNewBootcamp, updateBootcamp, tracks }: Props) {
  const { register, handleSubmit, setValue, watch } = useForm();
  const {showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
  const {showConfirmationPopup, confirmationPopupContent, confirmationPopupType, confirmationPopupHandler, customPopup, closeConfirmationPopup} = useCustomConfirmationPopup();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
  const totalPages = Math.ceil(bootcamps?.length / itemsPerPage);
  
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const paginatedBootcamps = bootcamps?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteBootcamp = async (i: number) => {
    closeConfirmationPopup();
    await deleteBootcamp(i);
    
    customAlert('message',"Delete Successful",`Successfully removed bootcamp from database.`);
  }

  const handleUpdateBootcamp = async (data: FieldValues) => {
    closeConfirmationPopup();
    for(let i=0; i<bootcamps!.length; i++){
      const newBootcamp: BootcampRequest = {
        guidId: bootcamps![i].guidId,
        name: data[`name${i}`],
        graduationDate:  new Date (data[`dategraduate${i}`]),
        trackId: parseInt(data[`track${i}`])
      };

      try{
        await updateBootcamp(newBootcamp);

        customAlert('success',"Updated Bootcamps Successfully.",`Successfully removed bootcamp from database.`);
      } catch (error) {

        customAlert('fail',"Error Updating Bootcamp",`${error}`);
      }
      
    }
  }

  const confirmChangeBootcampHandler = async (data: FieldValues) => {
    customPopup('question2', "Are you sure you want to change existing bootcamps?", "This can be a destructive if you've already generated diplomas with that bootcamp.", () => () => handleUpdateBootcamp(data));
  };

  const confirmDeleteBootcampHandler = async (index: number) => {
    customPopup('warning2', "Warning", <>By deleting this, you will lose <b style={{color: '#EF4444'}}>ALL OF THE DIPLOMAS</b> associated with this bootcamp. This action cannot be undone.</>, () => () => handleDeleteBootcamp(index));
  };


  return (
    <>
      <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert}/>
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
                        <th>Bootcamp name</th>
                        <th>Graduation Date</th>
                        <th>Track</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBootcamps &&
                        paginatedBootcamps.map((bootcamp, index) => (
                          // Display existing bootcamps
                          <tr className="table-row" key={`tablecell_${bootcamp.guidId}`}>
                            <td className="table-cell">
                              <input
                                type="text"
                                {...register(`name${index}`)}
                                defaultValue={bootcamp.name}
                                className="date-input disabled"
                                disabled
                              />
                            </td>
                            <td className="table-cell">
                              <input
                                id={bootcamp.guidId + "1"}
                                {...register(`dategraduate${index}`)}
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
                                value={watch(`track${index}`, bootcamp.track.id.toString())}
                                onChange={(e) => {
                                  setValue(`track${index}`, e.target.value);
                                  bootcamp.track.id = parseInt(e.target.value);
                                }}
                                reactHookForm={true}
                                register={register}
                                name={`track${index}`}
                              />
                            </td>
                            <td>
                              <DeleteButtonSimple onClick={() => confirmDeleteBootcampHandler(index)}/>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
              </div>
              <div className="modal-main-footer">
                <AddNewBootcampForm addNewBootcamp={addNewBootcamp} bootcamps={bootcamps} tracks={tracks}/>
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
  )

}