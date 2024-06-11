import { useForm, FieldValues } from "react-hook-form";
import TagsInput from "./TagsInput/TagsInput";
import { useState } from "react";
import { BootcampResponse } from "../util/types";
import { deleteBootcampById } from "../services/bootcampService";
import { EditText, EditTextarea } from 'react-edit-text';

type FormData = {
  classname: string;
  datebootcamp: string;
  names: string;
};

type Props = {
  SetFormInfo: (data: any) => void;
  bootcamps: BootcampResponse[] | null;
  deleteBootcamp: (i: number) => Promise<void>;
};

export default function AddDiplomaForm({ SetFormInfo, bootcamps, deleteBootcamp }: Props) {
  const { register, handleSubmit } = useForm<FormData>();
  const [names, setNames] = useState<string[]>([]);
  const [isManageBootcamp, setIsManageBootcamp] = useState<boolean>(false);

    const submitAndMakePDF = (data: FieldValues) => {
        const formData: FormData = {
            classname: data.classname,
            datebootcamp: data.datebootcamp,
            names: names
        }
        console.log(formData.names);
        SetFormInfo(formData);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    };

    function showBootcamps(){
      setIsManageBootcamp(!isManageBootcamp);
    }

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(submitAndMakePDF)();
        }}
        onKeyDown={handleKeyDown}
        className="space-y-4 p-6 bg-white rounded shadow-md"
      >
        <div className="select-bootcamp">
          <label htmlFor="classname" className="block text-sm font-medium text-gray-700">
            Class Name
          </label>
          <select
            id="classname"
            {...register("classname")}
            className="mt-1 w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            
          {
            bootcamps &&(
              bootcamps!.map((bootcamp => 
                <option value={bootcamp.name}>{bootcamp.name}</option>
              ))
            )
          }
            
          </select>
          <button type="button" onClick={showBootcamps} className="w-1/4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Manage
          </button>
          {(isManageBootcamp && bootcamps) &&(
            <div className="group relative">
              {
                bootcamps!.map((bootcamp, index) => 
                  <p className="block text-lg font-medium text-gray-700">
                    <EditText defaultValue={bootcamp.name}/>
                    <button type="button" onClick={() => deleteBootcamp(index)} className="left-full ml-2 text-red-500 ">delete</button>
                </p>
                )
              }
          </div>
          )}
        </div>
  
        <div>
          <label htmlFor="datebootcamp" className="block text-sm font-medium text-gray-700">
            Date of Bootcamp
          </label>
          <input
            id="datebootcamp"
            {...register("datebootcamp")}
            type="date"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
  
        <div>
          <label htmlFor="names" className="block text-sm font-medium text-gray-700">
            Student Names
          </label>
          {/* <textarea
            id="names"
            {...register("names")}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          /> */}
          <TagsInput 
            selectedTags={(names: string[]) => setNames(names)} 
          />
        </div>
  
        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply
          </button>
        </div>
      </form>
    );
  }
