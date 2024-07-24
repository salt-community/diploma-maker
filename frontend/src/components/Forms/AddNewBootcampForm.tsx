import { BootcampRequest, BootcampResponse } from "../../util/types";
import { useState } from "react";
import { AlertPopup, PopupType } from "../MenuItems/Popups/AlertPopup";
import { useCustomAlert } from "../Hooks/useCustomAlert";
import './AddNewBootcampForm.css'

type Props = {
    addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
    bootcamps: BootcampResponse[] | null;
}


export default function AddNewBootcampForm({ addNewBootcamp, bootcamps }: Props) {
    const [name, setName] = useState<string>("");
    const [gradDate, setGradDate] = useState<Date>();

    const { showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();

    async function submitToAddBootcamp(){
        if(name == ""){
            customAlert('fail', "Input Validation Error", "Name cannot be empty");
            return;
        }
        bootcamps!.forEach(bootcamp => {
            if(bootcamp.name == name){
                customAlert('fail', "Input Validation Error", "The name already exists");
                return;
            }
        });
        const newBootcamp: BootcampRequest = {name: name,  graduationDate: gradDate}
        await addNewBootcamp(newBootcamp);

        customAlert('success', "Successfully added!", "Successfully added new bootcamp to database");
    }

    return (
        <div className="content-container">
            <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert}/>
            <br />
            <table className="auto-table">
                <tbody>
                    <tr>
                        <td className="input-cell">
                            <input 
                                type="text" 
                                onChange={event => setName(event.target.value)} 
                                className="text-input"
                            />
                        </td>
                        <td className="date-cell">
                            <input 
                                type="date" 
                                onChange={event => setGradDate(new Date(event.target.value))} 
                                className="date-input"
                            />
                        </td>
                        <td>
                            <button onClick={submitToAddBootcamp} className="add-button">Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}