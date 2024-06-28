import { useForm } from "react-hook-form";
import TagsInput from "./TagsInput/TagsInput";
import { useEffect, useState } from "react";
import { BootcampResponse, TemplateResponse, SaltData } from "../util/types";
import { FileUpload } from "./MenuItems/Inputs/FileUploader";
import { ParseFileData } from '../services/InputFileService';

type Props = {
  bootcamps: BootcampResponse[] | null;
  templates: TemplateResponse[] | null;
  saltData: SaltData;
  updateSaltData: (data: SaltData) => void;
  setSelectedBootcampIndex: (index: number) => void;
  selectedBootcampIndex: number;
};

export default function AddDiplomaForm({ updateSaltData, bootcamps, setSelectedBootcampIndex, saltData, templates, selectedBootcampIndex}: Props) 
{
  const {register } = useForm();
  const [names, setNames] = useState<string[]>(saltData.names);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateResponse>(saltData.template);
  const [bootcampsCache, setBootcampsCache] = useState<BootcampResponse[] | null>();

  useEffect(() => {
    setBootcampsCache(bootcamps);
    updateSaltData({
      ...saltData,
      template: selectedTemplate
    });
  }, [selectedTemplate]);

  useEffect(() => {
    updateSaltData({
      ...saltData,
      names,
    });
  }, [names]);

  const handleFileUpload = async (file: File) => {
    const dataFromFile = await ParseFileData(file);
    console.log(dataFromFile)
    const names = dataFromFile.map(item => item.Name);
    setNames(names);
  };

  return (
    <form
      className="space-y-4 p-6 rounded shadow-md ml-10 mr-10 rounded-2xl dark: bg-darkbg2"
    >
      {/* Select bootcamp Class */}

      <div className="select-bootcamp mb-6">
        <label htmlFor="classname" className="block text-lg font-medium  text-gray-700 dark: text-white">
          Class Name
        </label>
        <select
          id="classname"
          {...register("classname")}
          className="mt-2 w-8/12 py-2 px-3 order border-gray-300 dark:border-none bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm  dark:bg-darkbg dark:text-white"
          onChange={(e) => { 
            setSelectedBootcampIndex(e.target.selectedIndex) 
            const selectedTemplateName = bootcampsCache![selectedBootcampIndex].template.templateName;
            const selectedTemplateObject = templates!.find(template => template.templateName === selectedTemplateName);
            setSelectedTemplate(selectedTemplateObject!);
          }}
          value={saltData.classname}
        >

          {
            bootcamps && (
              bootcamps!.map(((bootcamp, index) =>
                <option key={index} value={bootcamp.name}>{bootcamp.name}</option>
              ))
            )
          }
        </select>
      </div>



      {/* Select Template name */}

      <div className="select-template mb-6">
        <label htmlFor="templateName" className="block text-lg font-medium text-gray-700 dark: text-white">
          Template Name
        </label>
        <select
          id="templateName"
          className="mt-2 w-8/12 py-2 px-3 border border-gray-300 dark:border-none bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-darkbg dark:text-white"
          onChange={(e) => {
            const selectedTemplateName = e.target.value;
            const selectedTemplateObject = templates!.find(template => template.templateName === selectedTemplateName);
            setSelectedTemplate(selectedTemplateObject!);
          }}
          value={selectedTemplate!.templateName}
        >
          {
            templates && (
              templates.map((template, index) =>
                <option key={index} value={template.templateName}>{template.templateName}</option>
              )
            )
          }
        </select>

      </div>

      {/* Select student Names */}

      <div>
        <label htmlFor="names" className="block text-lg font-medium text-gray-700 dark: text-white">
          Student Names
        </label>
        <TagsInput
          selectedTags={(names: string[]) => setNames(names)}
          tags={saltData.names}
        />
      </div>
      <div>
        <label htmlFor="names" className="block text-lg font-medium text-gray-700 dark: text-white mb-2">
          Upload Student Information
        </label>
        <FileUpload FileHandler={handleFileUpload} />
      </div>

    </form>
  );
}
