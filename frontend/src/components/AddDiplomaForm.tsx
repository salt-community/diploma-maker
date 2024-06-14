import { useForm, FieldValues, UseFormRegister } from "react-hook-form";
import TagsInput from "./TagsInput/TagsInput";
import { useState } from "react";
import { BootcampRequest, BootcampResponse } from "../util/types";
import BootcampManagement from "../pages/BootcampManagement";
import { Link } from "react-router-dom";



type FormData = {
  classname: string;
  datebootcamp: string;
  names: string;
};

type Props = {
  SetFormInfo: (data: any) => void;
  bootcamps: BootcampResponse[] | null;
  deleteBootcamp: (i: number) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
};

export default function AddDiplomaForm({ SetFormInfo, bootcamps, deleteBootcamp, addNewBootcamp }: Props) {
  const {register, handleSubmit} = useForm();
  const [names, setNames] = useState<string[]>([]);


    const submitAndMakePDF = (data: FieldValues) => {
        const formData: FormData = {
            classname: data.classname,
            datestart: data.datestart,
            dategraduate: data.dategraduate,
            names: names,
        }
        console.log(formData.names);
        SetFormInfo(formData);
        
        const newBootcamp: BootcampRequest = {name: data.newname, startDate: data.newstartdate, graduationDate: data.newgraduatedate};
        addNewBootcamp(newBootcamp);
        
        
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    };

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(submitAndMakePDF)();
        }}
        onKeyDown={handleKeyDown}
        className="space-y-4 p-6 bg-white rounded shadow-md dark: bg-darkbg2 ml-10 mr-10 rounded-2xl"
      >
        <div className="select-bootcamp">
          <label htmlFor="classname" className="block text-sm font-medium text-gray-700 dark: text-white">
            Class Name
          </label>
          <select
            id="classname"
            {...register("classname")}
            className="mt-1 w-3/4 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-darkbg dark:text-white"
          >
            
          {
            bootcamps &&(
              bootcamps!.map((bootcamp => 
                <option value={bootcamp.name}>{bootcamp.name}</option>
              ))
            )
          }
          </select>
          
          <Link to="/bootcamp-management">
            <button type="button" className="w-1/4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Manage
            </button>
          </Link>
        </div>
  
        <div>
          <label htmlFor="names" className="block text-sm font-medium text-gray-700 dark: text-white">
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
        {/* {bootcamps &&
          <p>{new Date(bootcamps[0].startDate).toLocaleDateString()}</p>
        } */}
      </form>
    );
  }
