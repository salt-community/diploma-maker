import { useForm } from "react-hook-form";
import { BootcampRequest, BootcampResponse } from "../util/types";
import { useState } from "react";

type Props = {
    addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
    bootcamps: BootcampResponse[] | null;
}


export default function AddNewBootcampForm({ addNewBootcamp, bootcamps }: Props) {
    const [name, setName] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>();
    const [gradDate, setGradDate] = useState<Date>();

    async function submitToAddBootcamp(){
        if(name == ""){
            alert("Name cannot be empty");
            return;
        }
        bootcamps!.forEach(bootcamp => {
            if(bootcamp.name == name){
                alert("The name already exists");
                return;
            }
        });
       const newBootcamp: BootcampRequest = {name: name, startDate: startDate, graduationDate: gradDate}
       await addNewBootcamp(newBootcamp);
       alert("Successfully added new bootcamp")
    }


    return (
        <div className="relative flex-auto">
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