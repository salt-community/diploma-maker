import { useForm } from "react-hook-form";
import TagsInput from "../../components/TagsInput/TagsInput";
import { useEffect, useState } from "react";
import { BootcampResponse, TemplateResponse, SaltData, Student, FormDataUpdateRequest } from "../../util/types";
import { FileUpload } from "../../components/MenuItems/Inputs/FileUploader";
import { ParseFileData } from '../../services/InputFileService';
import { generateVerificationCode, mapBootcampToSaltData, newGenerateCombinedPDF } from "../../util/helper";
import './DiplomaDataForm.css';
import { UpdateBootcampWithNewFormdata } from "../../services/bootcampService";
import { PopupType } from "../../components/MenuItems/Popups/AlertPopup";
import { Template } from "@pdfme/common";
import { mapTemplateInputsBootcampsToTemplateViewer, templateInputsFromBootcampData } from "../../util/dataHelpers";

//exportera till types folder när typerna är satta
type FormData = {
  bootcamp: string;
  template: string;
  optionA: boolean;
  optionB: boolean;
  optionC: boolean;
  pdfGenerationScope: 'all' | 'selected';
}

type Props = {
  UpdateBootcampWithNewFormdata: (updateFormDataRequest: FormDataUpdateRequest, guidid: string) => void;
  bootcamps: BootcampResponse[] | null;
  templates: TemplateResponse[] | null;
  saltData: SaltData;
  updateSaltData: (data: SaltData) => void;
  setSelectedBootcampIndex: (index: number) => void;
  selectedBootcampIndex: number;
  fullscreen: boolean;
  customAlert: (alertType: PopupType, title: string, content: string) => void;
  setLoadingMessage: (message: string) => void;
};

export default function DiplomaDataForm({ updateSaltData, bootcamps, setSelectedBootcampIndex, saltData, templates, selectedBootcampIndex, fullscreen, UpdateBootcampWithNewFormdata, customAlert, setLoadingMessage }: Props) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
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
    const updatedStudents = dataFromFile.map(student => ({
      ...student,
      verificationCode: generateVerificationCode()
    }));
    setStudents(updatedStudents);
  };

  const postSelectedBootcampData = async (both?: Boolean) => {
    customAlert('loading', 'Adding Diplomas...', '');
    const updateFormDataRequest: FormDataUpdateRequest = {
      students: saltData.students.map((student) => ({
        guidId: student?.guidId,
        name: student.name,
        email: student.email,
        verificationCode: student.verificationCode
      })),
      templateId: selectedTemplate.id
    };

    try {
      await UpdateBootcampWithNewFormdata(updateFormDataRequest, saltData.guidId);
      both 
        ? customAlert('loading', 'Diplomas added...', '')
        : customAlert('success', "Diplomas added successfully.", "Successfully added diplomas to the database.");

    } catch (error) {
      customAlert('fail', "Failed to add diplomas:", `${error}`);
    }

    
    
  }

  const generatePDFHandler = async () => {
    customAlert('loading', 'Processing Template Data...', '');
    if (!bootcamps || !templates) {
      customAlert('fail', "Error", "Bootcamps or Templates data is missing.");
      return;
    }
    const templatesArr: Template[] = [];
    const inputsArray = students.map(student => {
      const selectedBootcamp = bootcamps.find(b => b.students.some(s => s.guidId === student.guidId));

      if (!selectedBootcamp) {
        customAlert('fail', "Error", `Bootcamp for student ${student.name} not found.`);
        return null;
      }
      const templateData = templates.find(t => t.id === selectedBootcamp.templateId);
      if (!templateData) {
        customAlert('fail', "Error", `Template for bootcamp ${selectedBootcamp.name} not found.`);
        return null;
      }

      const inputs = templateInputsFromBootcampData(mapBootcampToSaltData(selectedBootcamp, templateData), student.name, student.verificationCode);
      templatesArr.push(mapTemplateInputsBootcampsToTemplateViewer(templateData, inputs));
      return inputs;
    }).filter(inputs => inputs !== null);

    customAlert('loading', 'Generating Pdfs...', '');

    if (inputsArray.length === 0) {
      customAlert('fail', "Error", "No valid inputs found for PDF generation.");
      return;
    }

    const setLoadingMessageAndAlert = (message: string) => {
      setLoadingMessage(message);
      customAlert('loading', message, '');
    };

    await newGenerateCombinedPDF(templatesArr, inputsArray, setLoadingMessageAndAlert);
    customAlert('success', "PDFs Generated", "The combined PDF has been successfully generated.");
  };

  const validateOptions = () => {
    const optionA = watch('optionA');
    const optionB = watch('optionB');
    const optionC = watch('optionC');
    return optionA || optionB || optionC || "At least one option must be selected.";
  };

  const onSubmit = (data: FormData) => {
    if(data.optionA && data.optionB){
      postSelectedBootcampData(true)
    }
    else if(data.optionA){
      postSelectedBootcampData()
    }
    if(data.optionB){
      generatePDFHandler()
    }
  };

  return (
    <form className={`space-y-4 p-6 rounded shadow-md ml-10 mr-10 rounded-2xl dark: bg-darkbg2 ${fullscreen ? "full-screen-mode" : ""}`} onSubmit={handleSubmit(onSubmit)}>
      {/* Select bootcamp Class */}
      <div className="select-bootcamp mb-6">
        <label htmlFor="bootcamp" className="block text-lg font-medium text-gray-700 dark: text-white">
          Class Name
        </label>
        <select
          id="bootcamp"
          {...register("bootcamp")}
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
        <label htmlFor="template" className="block text-lg font-medium text-gray-700 dark: text-white">
          Template Name
        </label>
        <select
          id="template"
          {...register("template")}
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

      {/* Example Checkboxes */}
      <div className="checkboxes mb-6">
        <label htmlFor="upload" className="block text-lg font-medium text-gray-700 dark: text-white mb-2">
          PDF-Generation options
        </label>
        <div className="flex flex-col space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              {...register("optionA", { validate: validateOptions })}
              className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-gray-700 dark:text-white">Update changes made to Bootcamp</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("optionB", { validate: validateOptions })}
              className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-gray-700 dark:text-white">Generate all PDF in new window</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("optionC", { validate: validateOptions })}
              className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-gray-700 dark:text-white">Email each student their diploma</span>
          </label>
        </div>
        {errors.optionA && <p className="text-red-500">{errors.optionA.message}</p>}

      </div>

      <div className="radio-group mb-6">

        <div className="flex flex-col space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="all"
              defaultChecked
              {...register("pdfGenerationScope")}
              className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-gray-700 dark:text-white"> perform actions on all  students</span>

          </label>
          <label className="flex items-center">

            <input
              type="radio"
              value="selected"
              {...register("pdfGenerationScope")}
              className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-gray-700 dark:text-white">ONLY perform actions on selected student</span>
          </label>
        </div>
      </div>

      <button type="submit" className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2">
        Submit
      </button>
    </form>
  );
}
