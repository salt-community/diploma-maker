import { useForm } from "react-hook-form";
import TagsInput from "../../TagsInput/TagsInput";
import { useEffect, useState } from "react";
import { TemplateResponse, SaltData, Student, FormDataUpdateRequest, TrackResponse } from "../../../util/types";
import { FileUpload } from "../../MenuItems/Inputs/FileUploader";
import { ParseFileData } from '../../../services/InputFileService';
import { generateVerificationCode, mapBootcampToSaltData, mapBootcampToSaltData2, newGenerateCombinedPDF } from "../../../util/helper";
import './DiplomaDataForm.css';
import { PopupType } from "../../MenuItems/Popups/AlertPopup";
import { Template } from "@pdfme/common";
import { mapTemplateInputsBootcampsToTemplateViewer, templateInputsFromBootcampData } from "../../../util/dataHelpers";
import { SelectOptions } from "../../MenuItems/Inputs/SelectOptions";
import { CheckboxGroup } from "../../MenuItems/Inputs/CheckBoxGroup";
import { UpdateIcon } from "../../MenuItems/Icons/UpdateIcon";
import { OpenIcon } from "../../MenuItems/Icons/OpenIcon";
import { ExclusiveCheckBoxGroup } from "../../MenuItems/Inputs/ExclusiveCheckBoxGroup";
import { PublishButton } from "../../MenuItems/Buttons/PublishButton";

//exportera till types folder när typerna är satta
type FormData = {
  optionA: boolean;
  optionB: boolean;
  optionC: boolean;
  pdfGenerationScope: 'all' | 'selected';
}

type Props = {
  UpdateBootcampWithNewFormdata: (updateFormDataRequest: FormDataUpdateRequest, guidid: string) => void;
  setSaltData: (data: SaltData) => void;
  templates: TemplateResponse[] | null;
  tracks: TrackResponse[]
  customAlert: (alertType: PopupType, title: string, content: string) => void;
  setLoadingMessage: (message: string) => void;
  /*   fullscreen: boolean; */
};

export default function DiplomaDataForm({ setSaltData, tracks, templates, UpdateBootcampWithNewFormdata, customAlert, setLoadingMessage }: Props) {

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  const [AllTrackData, setAllTrackData] = useState<TrackResponse[]>(tracks);
  const [TrackIndex, setTrackIndex] = useState<number>(0)
  const [BootcampIndex, setBootcampIndex] = useState<number>(0);
  const [students, setStudents] = useState<Student[]>(tracks[0].bootcamps[0].students);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateResponse>(templates.find(template => template.id === tracks[0].bootcamps[0].templateId));

  useEffect(() => {
    const updatedAllTrackData = [...AllTrackData];
    const selectedTrack = updatedAllTrackData[TrackIndex];
    const selectedBootcamp = selectedTrack.bootcamps[BootcampIndex];
    selectedBootcamp.templateId = selectedTemplate.id;
    selectedBootcamp.students = students;
    updatedAllTrackData[TrackIndex].bootcamps[BootcampIndex] = selectedBootcamp;
    setAllTrackData(updatedAllTrackData);
    const saltData = mapBootcampToSaltData2(AllTrackData[TrackIndex].name, selectedBootcamp, templates!.find(t => t.id === selectedBootcamp.templateId));
    setSaltData(saltData);
    console.log("")

  }, [students, selectedTemplate]);


  useEffect(() => {
    if (AllTrackData && templates) {
      const selectedBootcamp = AllTrackData[TrackIndex].bootcamps[BootcampIndex];
      setStudents(selectedBootcamp.students);
      const template = templates?.find(t => t.id === selectedBootcamp.templateId);
      setSelectedTemplate(template);
    }
  }, [TrackIndex, BootcampIndex, AllTrackData]);


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
      students: students.map((student: Student) => ({
        guidId: student.guidId,
        name: student.name,
        email: student.email,
        verificationCode: student.verificationCode
      })),
      templateId: selectedTemplate.id
    };

    try {

      await UpdateBootcampWithNewFormdata(updateFormDataRequest, AllTrackData[TrackIndex].bootcamps[BootcampIndex].guidId);
      both
        ? customAlert('loading', 'Diplomas added...', '')
        : customAlert('success', "Diplomas added successfully.", "Successfully added diplomas to the database.");

    } catch (error) {
      customAlert('fail', "Failed to add diplomas:", `${error}`);
    }



  }

  const generatePDFHandler = async () => {
    if (!tracks || !templates) {
      customAlert('fail', "Error", "Bootcamps or Templates data is missing.");
      return;
    }
    const templatesArr: Template[] = [];
    const selectedBootcamp = tracks[TrackIndex].bootcamps[BootcampIndex];
    const inputsArray = students.map(student => {
      const inputs = templateInputsFromBootcampData(mapBootcampToSaltData2(AllTrackData[TrackIndex].name, selectedBootcamp, selectedTemplate), student.name, student.verificationCode);
      templatesArr.push(mapTemplateInputsBootcampsToTemplateViewer(selectedTemplate, inputs));
      return inputs;
    })

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
    return optionA || optionB || optionC;
  };

  const onSubmit = (data: FormData) => {
    const isValid = validateOptions();
    if (!isValid) {
      customAlert('message', "", "At least one pdf generation option must be selected.");
      return;
    }
    if (data.optionA && data.optionB) {
      postSelectedBootcampData(true);
    } else if (data.optionA) {
      postSelectedBootcampData();
    }
    if (data.optionB) {
      generatePDFHandler();
    }
  };

  return (
    <form className="diploma-making-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Select Track */}
      <div className="diploma-making-form__select-track diploma-making-form__select-container">
        <label htmlFor="track" className="diploma-making-form__label">
          Track
        </label>
        <SelectOptions
          containerClassOverride='overview-page__select-container'
          selectClassOverride='overview-page__select-box'
          options={[
            ...AllTrackData.filter(track => track.bootcamps.length > 0).map((track) => ({
              value: track.id.toString(),
              label: track.name
            }))
          ]}
          onChange={(e) => {
            setTrackIndex(Number(e.target.value) - 1);
            setBootcampIndex(0);
          }}
        />
      </div>
      {/* Select bootcamp Class */}
      <div className="diploma-making-form__select-bootcamp diploma-making-form__select-container">
        <label htmlFor="bootcamp" className="diploma-making-form__label">
          Bootcamps
        </label>
        <SelectOptions
          containerClassOverride='overview-page__select-container'
          selectClassOverride='overview-page__select-box'
          options={[
            ... AllTrackData[TrackIndex].bootcamps.map((bootcamp) => ({
              value: bootcamp.guidId,
              label: bootcamp.name
            }))
          ]}
          onChange={(e) => {
            const selectedGuidId = e.target.value;
            const selectedBootcampIndex = AllTrackData[TrackIndex].bootcamps.findIndex(bootcamp => bootcamp.guidId === selectedGuidId);
            setBootcampIndex(selectedBootcampIndex);
          }}
          value={AllTrackData[TrackIndex].bootcamps[BootcampIndex].guidId}
        />
        
      </div>

      {/* Select Template name */}
      <div className="diploma-making-form__select-template diploma-making-form__select-container" >
        <label htmlFor="template" className="diploma-making-form__label">
          Template Options
        </label>
        <SelectOptions
          containerClassOverride='overview-page__select-container'
          selectClassOverride='overview-page__select-box'
          options={[
            ...templates.map((template) => ({
              value: template.id.toString(),
              label: template.name
            }))
          ]}
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const selectedTemplateObject = templates.find(template => template.id === selectedId);
            setSelectedTemplate(selectedTemplateObject);
          }}
          value={selectedTemplate.id.toString()}
        />
      </div>

      {/* Display student data */}
      <div className="diploma-making-form__student-data diploma-making-form__select-container">
        <label htmlFor="students" className="diploma-making-form__label">
          Student Names
        </label>
        <TagsInput
          selectedTags={(names) => setStudents(names.map(name => ({ name, email: '', verificationCode: generateVerificationCode() })))}
          tags={students.map(student => student.name)}
        />
      </div>

      <div className="diploma-making-form__upload diploma-making-form__select-container">
        <label htmlFor="upload" className="diploma-making-form__label diploma-making-form__label--mb">
          Upload Student Information
        </label>
        <FileUpload FileHandler={handleFileUpload} />
      </div>

      {/* Example Checkboxes */}
      <div className="diploma-making-form__checkboxes">
        <label htmlFor="upload" className="diploma-making-form__label diploma-making-form__label--mb">
          PDF-Generation options
        </label>
        <div className="diploma-making-form__checkbox-group">
        <CheckboxGroup items={[
              { 
                  icon: <UpdateIcon />, 
                  label: 'Update changes made to Bootcamp', 
                  validationOptions: {...register("optionA")}
              },
              { 
                  icon: <OpenIcon />, 
                  label: 'Open PDFs after generating', 
                  validationOptions: {...register("optionB")}
              },
          ]} 
          defaultChecked={[0, 1]} 
        />
        </div>
        {errors.optionA && <p className="diploma-making-form__error">{errors.optionA.message}</p>}
      </div>

      <div className="diploma-making-form__radio-group">
        <div className="diploma-making-form__radio-options">
        <ExclusiveCheckBoxGroup 
            items={[
              { 
                label: 'Generate pdfs for selected bootcamp',
                validationOptions: {...register("pdfGenerationScope", { value: 'all' })}
              },
              {
                label: 'Generate pdf for selected student',
                validationOptions: {...register("pdfGenerationScope", { value: 'selected' })}
              }
            ]}
            scope="pdfGenerationScope"
            defaultChecked={0}
          />
        </div>
      </div>
      <PublishButton classNameOverride="diploma-making-form__submit-button" text='Submit' onClick={() => {}} />
    </form>
  );

}
