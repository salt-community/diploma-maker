import { useForm, FieldValues } from "react-hook-form";
import TagsInput from "./TagsInput/TagsInput";
import { useState } from "react";
import { BootcampRequest, BootcampResponse, SaltData } from "../util/types";
import BootcampManagement from "../pages/BootcampManagement";
import { Link } from "react-router-dom";

type Props = {
  bootcamps: BootcampResponse[] | null;
  saltData: SaltData;
  updateSaltData: (data: SaltData) => void;
  deleteBootcamp: (i: number) => Promise<void>;
  setSelectedBootcampIndex: (index: number) => void;
};

export default function AddDiplomaForm({ updateSaltData, bootcamps, deleteBootcamp, setSelectedBootcampIndex, saltData }: Props) {
  const {register, handleSubmit} = useForm();
  const [names, setNames] = useState<string[]>([]);
  const [isManageBootcamp, setIsManageBootcamp] = useState<boolean>(false);

    const updateSaltDataHandler = (data: FieldValues) => {
        const newSaltData: SaltData = {
            classname: data.classname,
            datestart: data.datestart,
            dategraduate: data.dategraduate,
            names: names,
        }
        updateSaltData(newSaltData);
        
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
          handleSubmit(updateSaltDataHandler)();
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
            onChange={(e) => {setSelectedBootcampIndex(e.target.selectedIndex)}}
            value={saltData.classname}
          >
            
          {
            bootcamps &&(
              bootcamps!.map(((bootcamp, index) => 
                <option key={index} value={bootcamp.name}>{bootcamp.name}</option>
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
          <label htmlFor="names" className="block text-sm font-medium text-gray-700">
            Student Names
          </label>
          <TagsInput 
            selectedTags={(names: string[]) => setNames(names)} 
            tags={saltData.names}
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
