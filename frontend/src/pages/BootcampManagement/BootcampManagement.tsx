import { FieldValues, useForm } from "react-hook-form";
import { BootcampRequest, BootcampResponse } from "../../util/types"
import { useState } from "react";
import AddNewBootcampForm from "../../components/Forms/AddNewBootcampForm";
import { useNavigate } from "react-router-dom";
import { AlertPopup, PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import './BootcampManagement.css'

type Props = {
  bootcamps: BootcampResponse[] | null;
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
  updateBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
}

export default function BootcampManagement({ bootcamps, deleteBootcamp, addNewBootcamp, updateBootcamp }: Props) {
  const {register, handleSubmit} = useForm();
  const [showConfirmAlert, setShowConfirmAlert] = useState<number>(-1); 
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupContent, setPopupContent] = useState<string[]>(["",""]);
  const [popupType, setPopupType] = useState<PopupType>('success');

  function formatDate(date: Date){
    const dateConverted = new Date(date);
    dateConverted.setDate(dateConverted.getDate() + 1);
    var newDate = new Date(dateConverted).toISOString().split('T')[0]
    return newDate
  }

  async function handleDeleteBootcamp(i: number){
    await deleteBootcamp(i);
    setShowConfirmAlert(-1);
    
    setPopupType('fail');
    setPopupContent(["Delete Successful", "Successfully removed bootcamp from database."]);
    setShowPopup(true);
  }

  async function handleUpdateBootcamp(data: FieldValues){
    for(let i=0; i<bootcamps!.length; i++){
      const newBootcamp: BootcampRequest = {
        guidId: bootcamps![i].guidId,
        name: data[`name${i}`],
        graduationDate:  new Date (data[`dategraduate${i}`])
      };
      try{
        await updateBootcamp(newBootcamp);

        setPopupType('success');
        setPopupContent(["Updated Bootcamps Successfully.", "Successfully removed bootcamp from database."]);
        setShowPopup(true);
      } catch (error) {
        
        setPopupType('fail');
        setPopupContent(["Error Updating Bootcamp", "Successfully removed bootcamp from database."]);
        setShowPopup(true);
      }
      
    }
  }


  return (
    <form onSubmit={handleSubmit(handleUpdateBootcamp)}>
      <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={() => setShowPopup(false)}/>
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
                    <th>Start date</th>
                    <th>Graduation date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    bootcamps!.map((bootcamp, index) =>
                      // Display existing bootcamps
                      <tr key={bootcamp.guidId}>
                      <td className="table-cell">
                        <input
                          type="text"
                          {...register(`name${index}`)}
                          defaultValue = {bootcamp.name} 
                          className="date-input"
                        />
                      </td>
                        <td className="table-cell">
                          <input
                            id={bootcamp.guidId + "1"}
                            {...register(`dategraduate${index}`)}
                            type="date"
                            className="date-input"
                            defaultValue={formatDate(bootcamp.graduationDate)}
                            key={bootcamp.guidId}
                          />
                        </td>
                        <td>
                          <button type="button" onClick={() => setShowConfirmAlert(index)} className="delete-btn ">Delete</button>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
              <AddNewBootcampForm addNewBootcamp={addNewBootcamp} bootcamps={bootcamps}/>
            </div>
            {/*footer*/}
            <div className="footer-container">
              <button
                className="close-button"
                type="button"
                onClick={() => navigate(-1)}
              >
                Close
              </button>
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