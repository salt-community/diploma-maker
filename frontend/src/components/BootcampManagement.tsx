import { FieldValues, UseFormRegister, useForm } from "react-hook-form";
import { BootcampResponse } from "../util/types"
import { EditText, EditTextarea } from 'react-edit-text';

type Props = {
    bootcamps: BootcampResponse[];
    deleteBootcamp: (i: number) => Promise<void>;
    register: UseFormRegister<FieldValues>;
}

export default function BootcampManagement({ bootcamps, deleteBootcamp}: Props) {

    return (
        <div className="block font-medium text-gray-700">
            {
                bootcamps!.map((bootcamp, index) =>
                    <div>
                        <EditText defaultValue={bootcamp.name} />
                        <p></p>
                        <button type="button" onClick={() => deleteBootcamp(index)} className="left-full ml-2 text-red-500 ">delete</button>
                        <hr />
                    </div>
                )
                
            }
            <EditText placeholder="New bootcamp name" />
            <p></p>
            <button type="button" className="text-green-500">Add</button>

              
        <div className="dateofbootcamp">
          <label htmlFor="datebootcamp" className="block text-sm font-medium text-gray-700">
            Date of Bootcamp
          </label>
          <input
            id="datebootcamp"
            // {...register("datebootcamp")}
            type="date"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            defaultValue={"2024-01-01"}
          />
        </div>

        <div className="dateofgraduation">
          <label htmlFor="datebootcamp" className="block text-sm font-medium text-gray-700">
            Date of Graduation
          </label>
          <input
            id="datebootcamp"
            // {...register("datebootcamp")}
            type="date"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            defaultValue={"2024-01-01"}
          />
        </div>
        </div>

    )


}