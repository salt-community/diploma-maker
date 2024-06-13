import { FieldValues, UseFormRegister, useForm } from "react-hook-form";
import { BootcampRequest, BootcampResponse } from "../util/types"
import { EditText, EditTextarea } from 'react-edit-text';
import { Dispatch, SetStateAction, useState } from "react";
import AddNewBootcampForm from "../components/AddNewBootcampForm";

type Props = {
  bootcamps: BootcampResponse[] | null;
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
}

export default function BootcampManagement({ bootcamps, deleteBootcamp, addNewBootcamp }: Props) {
  const[selectedBootcamp, setSelectedBootcamp] = useState<BootcampResponse>();
  const {register, handleSubmit} = useForm();
  const [isManageBootcamp, setIsManageBootcamp] = useState<boolean>(false);

  function formatDate(date: Date){
    var newDate = new Date(date).toISOString().split('T')[0]
    return newDate
  }


  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none font-medium text-gray-700 "
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-2xl font-semibold">
                Bootcamp Management
              </h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
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
                      <tr>
                        <td className="pr-3"><EditText defaultValue={bootcamp.name} /></td>
                        <td className="pr-3">
                          <input
                            id={bootcamp.guidId}
                            {...register(`datestart${index}`)}
                            type="date"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            defaultValue={formatDate(bootcamp.startDate)}
                            key={bootcamp.guidId}
                          />
                        </td>
                        <td className="pr-3">
                          <input
                            id={bootcamp.guidId + "1"}
                            {...register(`dategraduate${index}`)}
                            type="date"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            defaultValue={formatDate(bootcamp.graduationDate)}
                            key={bootcamp.guidId}
                          />
                        </td>
                        <td>
                          <button type="button" onClick={() => deleteBootcamp(index)} className="left-full ml-2 text-red-500 ">Delete</button>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
              <AddNewBootcampForm addNewBootcamp={addNewBootcamp}/>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setIsManageBootcamp(false)}
              >
                Close
              </button>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 uppercase text-sm font-medium text-white px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setIsManageBootcamp(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )


}