import { BootcampRequest, BootcampResponse } from "../../util/types";
import { useState } from "react";
import { AlertPopup, PopupType } from "../MenuItems/Popups/AlertPopup";
import { useCustomAlert } from "../Hooks/useCustomAlert";

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
        <div className="relative flex-auto">
            <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert}/>
            <br />
            <table className="table-auto">
                <tbody>
                    <tr>
                        <td className="pr-6 ">
                            <input 
                                type="text" 
                                onChange={event => setName(event.target.value)} 
                                className="w-full mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                        </td>
    
                        <td className="pr-3">
                            <input 
                                type="date" 
                                onChange={event => setGradDate(new Date(event.target.value))} 
                                className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                        </td>
                        <td>
                            <button onClick={submitToAddBootcamp} className="left-full ml-2 text-green-500 ">Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}