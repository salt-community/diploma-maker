import { useForm } from "react-hook-form";
import { BootcampRequest } from "../util/types";

type Props = {
    addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
}


export default function AddNewBootcampForm({ addNewBootcamp }: Props) {
    const {register, handleSubmit} = useForm();

    function submitToAddBootcamp(){
        alert("submited")
    }


    return (
        <div className="relative flex-auto">
            <br />
            <table className="table-auto">
                <tbody>
                    <tr>
                        <td className="pr-6 ">
                            <input type="text" {...register("newname")} className="w-full mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </td>
                        <td className="pr-3"> 
                            <input type="date" {...register("newstartdate")} className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </td>
                        <td className="pr-3">
                            <input type="date" {...register("newgraduatedate")} className="mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </td>
                        <td>
                            <button type="submit" className="left-full ml-2 text-green-500 ">Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}