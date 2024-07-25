import { FieldValues, useForm, useWatch } from "react-hook-form";
import { BootcampRequest, BootcampResponse, TrackResponse } from "../../util/types"
import { useEffect, useState } from "react";
import AddNewBootcampForm from "../../components/Forms/AddNewBootcampForm";
import { AlertPopup, PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import './BootcampManagement.css'
import { SelectOptions } from "../../components/MenuItems/Inputs/SelectOptions";
import { useCustomAlert } from "../../components/Hooks/useCustomAlert";
import { useCustomConfirmationPopup } from "../../components/Hooks/useCustomConfirmationPopup";

type Props = {
  bootcamps: BootcampResponse[] | null;
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  updateBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  tracks: TrackResponse[];
}

export default function BootcampManagement({ bootcamps, deleteBootcamp, addNewBootcamp, updateBootcamp, tracks }: Props) {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [showConfirmAlert, setShowConfirmAlert] = useState<number>(-1); 

  const {showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();
  const {showConfirmationPopup,confirmationPopupContent,confirmationPopupType,confirmationPopupHandler,customPopup,closeConfirmationPopup} = useCustomConfirmationPopup();

  const formatDate = (date: Date) => {
    const dateConverted = new Date(date);
    dateConverted.setDate(dateConverted.getDate() + 1);
    var newDate = new Date(dateConverted).toISOString().split('T')[0]
    return newDate
  }

  const handleDeleteBootcamp = async (i: number) => {
    await deleteBootcamp(i);
    setShowConfirmAlert(-1);
    
    customAlert('success',"Delete Successful",`Successfully removed bootcamp from database.`);
  }

  const handleUpdateBootcamp = async (data: FieldValues) => {
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


  return (
    <form onSubmit={handleSubmit(handleUpdateBootcamp)}>
      <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert}/>
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
                  {bootcamps &&
                    bootcamps.map((bootcamp, index) => (
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
                            defaultValue={formatDate(bootcamp.graduationDate)}
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
                          <button
                            type="button"
                            onClick={() => setShowConfirmAlert(index)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <AddNewBootcampForm addNewBootcamp={addNewBootcamp} bootcamps={bootcamps} tracks={tracks}/>
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

      {/* confirm alert */}
      {showConfirmAlert >= 0 && 
        <div className="confirm-dialog">
            <div className="dialog-container">
                <div className="dialog-overlay"></div>
                <div className="dialog-content">
                    <div className="dialog-header">
                        <div className="dialog-icon">
                            <i className="bx bx-error">&#9888;</i>
                        </div>
                        <div className="dialog-message">
                            <p className="dialog-title">Warning!</p>
                            <p className="dialog-text">By deleting this, you will lose <b className="text-red-600">ALL OF THE DIPLOMAS</b> associated with this bootcamp. This action cannot be undone.</p>
                        </div>
                    </div>
                    <div className="dialog-actions">
                        <button onClick={() => setShowConfirmAlert(-1)} id="confirm-cancel-btn" className="cancel-button">
                            Cancel
                        </button>
                        <button onClick={() => handleDeleteBootcamp(showConfirmAlert)} id="confirm-delete-btn" className="delete-button">
                            Delete Permanently
                        </button>
                    </div>
                </div>
            </div>
        </div>
      }
    </form>
  )


}