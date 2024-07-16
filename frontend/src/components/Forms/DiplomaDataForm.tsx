import { useForm } from "react-hook-form";
import TagsInput from "../TagsInput/TagsInput";
import { useEffect, useState } from "react";
import { BootcampResponse, TemplateResponse, SaltData, Student } from "../../util/types";
import { FileUpload } from "../MenuItems/Inputs/FileUploader";
import { ParseFileData } from '../../services/InputFileService';
import { generateVerificationCode } from "../../util/helper";

type Props = {
  bootcamps: BootcampResponse[] | null;
  templates: TemplateResponse[] | null;
  saltData: SaltData;
  updateSaltData: (data: SaltData) => void;
  setSelectedBootcampIndex: (index: number) => void;
  selectedBootcampIndex: number;
};

export default function   ({ updateSaltData, bootcamps, setSelectedBootcampIndex, saltData, templates, selectedBootcampIndex}: Props) {
  const { register } = useForm();
  const [students, setStudents] = useState<Student[]>(saltData.students);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateResponse>(saltData.template);
  const [bootcampsCache, setBootcampsCache] = useState<BootcampResponse[] | null>();

  useEffect(() => {
    setBootcampsCache(bootcamps)
    
    updateSaltData({
      ...saltData,
      template: selectedTemplate
    });
  }, [selectedTemplate]);

  useEffect(() => {
    updateSaltData({
      ...saltData,
      students,
    });
  }, [students]);


  const handleFileUpload = async (file: File) => {
    const dataFromFile = await ParseFileData(file);
   
    setStudents(dataFromFile);
  };

  return (
    <form className="space-y-4 p-6 rounded shadow-md ml-10 mr-10 rounded-2xl dark: bg-darkbg2">
      {/* Select bootcamp Class */}
      <div className="select-bootcamp mb-6">
        <label htmlFor="classname" className="block text-lg font-medium text-gray-700 dark: text-white">
          Class Name
        </label>
        <select
          id="classname"
          {...register("classname")}
          className="mt-2 w-8/12 py-2 px-3 order border-gray-300 dark:border-none bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-darkbg dark:text-white"
          onChange={(e) => { 
            setSelectedBootcampIndex(e.target.selectedIndex) 
            const selectedId = bootcampsCache![selectedBootcampIndex].templateId;
            const selectedTemplateObject = templates!.find(template => template.id === selectedId);
            setSelectedTemplate(selectedTemplateObject!);
          }}
          value={saltData.classname}
        >
          {bootcamps && (
            bootcamps.map((bootcamp, index) =>
              <option key={index} value={bootcamp.name}>{bootcamp.name}</option>
            )
          )}
        </select>
      </div>

      {/* Select Template name */}
      <div className="select-template mb-6">
        <label htmlFor="name" className="block text-lg font-medium text-gray-700 dark: text-white">
          Template Name
        </label>
        <select
          id="name"
          className="mt-2 w-8/12 py-2 px-3 border border-gray-300 dark:border-none bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-darkbg dark:text-white"
          onChange={(e) => {
            const selectedname = e.target.value;
            const selectedTemplateObject = templates!.find(template => template.name === selectedname);
            setSelectedTemplate(selectedTemplateObject!);
          }}
          value={selectedTemplate.name}
        >
          {templates && (
            templates.map((template, index) =>
              <option key={index} value={template.name}>{template.name}</option>
            )
          )}
        </select>
      </div>

      {/* Display student data */}
      <div>
        <label htmlFor="students" className="block text-lg font-medium text-gray-700 dark: text-white">
          Student Names
        </label>
        <TagsInput
          selectedTags={(names: string[]) => setStudents(names.map(name => ({ name, email: '', verificationCode: generateVerificationCode() })))} // Adjust this based on how TagsInput is implemented
          tags={saltData.students.map(student => student.name)}
        />
      </div>

      <div>
        <label htmlFor="upload" className="block text-lg font-medium text-gray-700 dark: text-white mb-2">
          Upload Student Information
        </label>
        <FileUpload FileHandler={handleFileUpload} />
      </div>
    </form>
  );
}
