import { useForm } from "react-hook-form";
import { BootcampRequest, BootcampResponse } from "../util/types";
import { useState } from "react";
import { AlertPopup, PopupType } from "./MenuItems/Popups/AlertPopup";

type Props = {
    addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
    bootcamps: BootcampResponse[] | null;
}


export default function AddNewBootcampForm({ addNewBootcamp, bootcamps }: Props) {
    const [name, setName] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>();
    const [gradDate, setGradDate] = useState<Date>();

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupContent, setPopupContent] = useState<string[]>(["",""]);
    const [popupType, setPopupType] = useState<PopupType>(PopupType.success);

    async function submitToAddBootcamp(){
        if(name == ""){
            setPopupType(PopupType.fail);
            setPopupContent(["Input Validation Error", "Name cannot be empty"]);
            setShowPopup(true);
            // alert("Name cannot be empty");
            return;
        }
        bootcamps!.forEach(bootcamp => {
            if(bootcamp.name == name){
                setPopupType(PopupType.fail);
                setPopupContent(["Input Validation Error", "The name already exists"]);
                setShowPopup(true);
                // alert("The name already exists");
                return;
            }
        });
        const newBootcamp: BootcampRequest = {name: name, startDate: startDate, graduationDate: gradDate}
        await addNewBootcamp(newBootcamp);

        setPopupType(PopupType.success);
        setPopupContent(["Successfully added!", "Successfully added new bootcamp to database"]);
        setShowPopup(true);
        // alert("Successfully added new bootcamp")
    }

    return (
        <div className="relative flex-auto">
            <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={() => setShowPopup(false)}/>
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
                                onChange={event => setStartDate(new Date(event.target.value))}  
                                className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
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