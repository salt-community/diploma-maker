import { FieldValues, useForm } from "react-hook-form";
import { BootcampRequest, BootcampResponse } from "../util/types"
import { EditText } from 'react-edit-text';
import { useState } from "react";
import AddNewBootcampForm from "../components/AddNewBootcampForm";
import { useNavigate } from "react-router-dom";

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

  function formatDate(date: Date){
    var newDate = new Date(date).toISOString().split('T')[0]
    return newDate
  }

  async function handleDeleteBootcamp(i: number){
    await deleteBootcamp(i);
    setShowConfirmAlert(-1);
  }

  async function handleUpdateBootcamp(data: FieldValues){
    console.log("Updating...", data)
    for(let i=0; i<bootcamps!.length; i++){
      const newBootcamp: BootcampRequest = {
        guidId: bootcamps![i].guidId,
        name: data[`name${i}`],
        startDate:  new Date(data[`datestart${i}`]),
        graduationDate:  new Date (data[`dategraduate${i}`])
      };
      await updateBootcamp(newBootcamp);
    }
  }


  return (
    <form onSubmit={handleSubmit(handleUpdateBootcamp)}>
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
                      <tr key={bootcamp.guidId}>
                        <td className="pr-3"  {...register(`name${index}`)}><EditText defaultValue={bootcamp.name} /></td>
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
                          <button type="button" onClick={() => setShowConfirmAlert(index)} className="left-full ml-2 text-red-500 ">Delete</button>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
              <AddNewBootcampForm addNewBootcamp={addNewBootcamp} bootcamps={bootcamps}/>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => navigate(-1)}
              >
                Close
              </button>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 uppercase text-sm font-medium text-white px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

      {/* confirm alert */}
      {showConfirmAlert >= 0  && 
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur confirm-dialog ">
      <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
          <div className=" opacity-25 w-full h-full absolute z-10 inset-0"></div>
          <div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg">
              <div className="md:flex items-center">
                  <div className="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                  <i className="bx bx-error text-3xl">
                  &#9888;
                  </i>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                  <p className="font-bold">Warning!</p>
                  <p className="text-sm text-gray-700 mt-1">By deleting this, you will lose <b className="text-red-600">ALL OF THE DIPLOMAS</b> assosiated with this bootcamp. This action cannot be undone.
                  </p>
                  </div>
              </div>
              <div className="text-center md:text-right mt-4 md:flex md:justify-end">
                  <button onClick={() => handleDeleteBootcamp(showConfirmAlert)} id="confirm-delete-btn" className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2">
                      Delete Permenently
                  </button>
                  <button onClick={() => setShowConfirmAlert(-1)} id="confirm-cancel-btn" className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1">
                  Cancel
                  </button>
              </div>
          </div>
      </div>
  </div>}
    </form>
  )


}