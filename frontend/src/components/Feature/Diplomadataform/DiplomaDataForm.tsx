import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TemplateResponse, SaltData, Student, FormDataUpdateRequest, TrackResponse } from "../../../util/types";
import { FileUpload } from "../../MenuItems/Inputs/FileUploader";
import { ParseFileData } from '../../../services/InputFileService';
import { generateVerificationCode, mapBootcampToSaltData2, newGenerateCombinedPDF } from "../../../util/helper";
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
import { TagsInput } from "../../TagsInput/TagsInput";

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
  tracks: TrackResponse[];
  customAlert: (alertType: PopupType, title: string, content: string) => void;
  setLoadingMessage: (message: string) => void;
  selectedStudentIndex: number | null;
  setSelectedStudentIndex: (idx: number) => void;
};

export default function DiplomaDataForm({ setSaltData, tracks, templates, UpdateBootcampWithNewFormdata, customAlert, setLoadingMessage, selectedStudentIndex, setSelectedStudentIndex }: Props) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  const [AllTrackData, setAllTrackData] = useState<TrackResponse[]>();
  const [TrackIndex, setTrackIndex] = useState<number>(0);
  const [BootcampIndex, setBootcampIndex] = useState<number>(0);
  const [students, setStudents] = useState<Student[]>();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateResponse>();
  const [attachedFiles, setAttachedFiles] = useState<{ [key: string]: File | null }>({});

  const [disableNavbar, setDisableNavbar] = useState<boolean>(false);

  useEffect(() => {
    if(tracks && templates){
      const filteredTracks = tracks.filter(t => t.bootcamps.length > 0);
      setAllTrackData(filteredTracks);
    }
    if(AllTrackData){
      const updatedAllTrackData = [...AllTrackData];
      const selectedTrack = updatedAllTrackData[TrackIndex];
      const selectedBootcamp = selectedTrack.bootcamps[BootcampIndex];
      selectedBootcamp.templateId = selectedTemplate.id;
      selectedBootcamp.students = students;
      updatedAllTrackData[TrackIndex].bootcamps[BootcampIndex] = selectedBootcamp;
      setAllTrackData(updatedAllTrackData);
      const saltData = mapBootcampToSaltData2(AllTrackData[TrackIndex].name, selectedBootcamp, templates!.find(t => t.id === selectedBootcamp.templateId));
      setSaltData(saltData);
    }
  }, [students, selectedTemplate]);

  useEffect(() => {
    if (AllTrackData && templates) {
      const selectedTrack = AllTrackData[TrackIndex];
      const selectedBootcamp = selectedTrack?.bootcamps[BootcampIndex];
      if (selectedBootcamp) {
        setStudents(selectedBootcamp.students);
        const template = templates?.find(t => t.id === selectedBootcamp.templateId);
        setSelectedTemplate(template);
      } else {
        setStudents([]);
        setSelectedTemplate(null);
      }
    }
  }, [TrackIndex, BootcampIndex, AllTrackData]);

  const handleFileUpload = async (file: File) => {
    const dataFromFile = await ParseFileData(file);
    const updatedStudents = dataFromFile.map(student => ({
      ...student,
      verificationCode: generateVerificationCode()
    }));
    setStudents(updatedStudents);

    const bootcampGuid = AllTrackData[TrackIndex].bootcamps[BootcampIndex].guidId;
    setAttachedFiles({ ...attachedFiles, [bootcampGuid]: file });
  };

  const postSelectedBootcampData = async (both?: Boolean) => {
    setDisableNavbar(true);
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
        ? ''
        : customAlert('success', "Diplomas added successfully.", "Successfully added diplomas to the database.");

        setDisableNavbar(false);
    } catch (error) {
      customAlert('fail', "Failed to add diplomas:", `${error}`);
      setDisableNavbar(false);
    }
  }

  const generatePDFHandler = async (pdfGenerationScope: 'all' | 'selected') => {
    if (!tracks || !templates) {
      customAlert('fail', "Error", "Bootcamps or Templates data is missing.");
      return;
    }

    const selectedBootcamp = tracks[TrackIndex].bootcamps[BootcampIndex];
    const templatesArr: Template[] = [];
    let inputsArray;

    if (pdfGenerationScope === 'selected' && selectedStudentIndex !== null) {
      const student = students[selectedStudentIndex];
      const inputs = templateInputsFromBootcampData(mapBootcampToSaltData2(AllTrackData[TrackIndex].name, selectedBootcamp, selectedTemplate), student.name, student.verificationCode);
      templatesArr.push(mapTemplateInputsBootcampsToTemplateViewer(selectedTemplate, inputs));
      inputsArray = [inputs];
    } else {
      inputsArray = students.map(student => {
        const inputs = templateInputsFromBootcampData(mapBootcampToSaltData2(AllTrackData[TrackIndex].name, selectedBootcamp, selectedTemplate), student.name, student.verificationCode);
        templatesArr.push(mapTemplateInputsBootcampsToTemplateViewer(selectedTemplate, inputs));
        return inputs;
      });
    }

    customAlert('loading', 'Generating PDFs...', '');

    if (inputsArray.length === 0) {
      customAlert('fail', "Error", "No valid inputs found for PDF generation.");
      return;
    }

    const setLoadingMessageAndAlert = (message: string) => {
      setLoadingMessage(message);
      customAlert('loading', message, '');
    };

    try {
      await newGenerateCombinedPDF(templatesArr, inputsArray, setLoadingMessageAndAlert);
      customAlert('loadingfadeout', '', '');
      await alertSuccess();
    } catch (error) {
      customAlert('fail', "Failed to generate pdfs", `${error}`);
    }
    
  };

  const alertSuccess = async () => {
    customAlert('success', "PDFs Generated", "The combined PDF has been successfully generated.");
  }

  const validateOptions = () => {
    const optionA = watch('optionA');
    const optionB = watch('optionB');
    const optionC = watch('optionC');
    return optionA || optionB || optionC;
  };

  const onSubmit = (data: FormData) => {
    
    if (!validateOptions()) {
      customAlert('message', "", "At least one PDF generation option must be selected.");
      return;
    }
    if(students.length < 1){
      customAlert('message', "Failed!", "Your bootcamp needs students, Please add one or a few");
      return;
    }
    if (data.optionA && data.optionB) {
      postSelectedBootcampData(true);
    } else if (data.optionA) {
      postSelectedBootcampData();
    }
    if (data.optionB) {
      generatePDFHandler(data.pdfGenerationScope);
    }
  };

  return (
    <>
      <form className="diploma-making-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="diploma-making-form__select-track diploma-making-form__select-container">
          <label htmlFor="track" className="diploma-making-form__label">
            Track group
          </label>
          {AllTrackData && 
            <SelectOptions
              containerClassOverride='overview-page__select-container'
              selectClassOverride='overview-page__select-box'
              options={[
                ...AllTrackData.filter(track => track.bootcamps.length > 0).map((track, idx) => ({
                  value: idx.toString(),
                  label: track.name
                }))
              ]}
              onChange={(e) => {
                setTrackIndex(Number(e.target.value));
                setBootcampIndex(0);
              }}
            />
          }
        </div>
        <div className="diploma-making-form__select-bootcamp diploma-making-form__select-container">
          <label htmlFor="bootcamp" className="diploma-making-form__label">
            Bootcamp
          </label>
          {AllTrackData &&
            <SelectOptions
              containerClassOverride='overview-page__select-container'
              selectClassOverride='overview-page__select-box'
              options={[
                ...AllTrackData[TrackIndex].bootcamps.map((bootcamp) => ({
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
          }
        </div>

        <div className="diploma-making-form__select-template diploma-making-form__select-container">
          <label htmlFor="template" className="diploma-making-form__label">
            Applied Template
          </label>
          {selectedTemplate && 
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
          }
        </div>

        <div className="diploma-making-form__student-data diploma-making-form__select-container">
          <div className="diploma-making-form__student-data__label-wrapper">
            <label htmlFor="students" className="diploma-making-form__label">
              Student Names
            </label>
            <label htmlFor="upload" className="diploma-making-form__label diploma-making-form__label--mb">
              Upload Student Information
            </label>
          </div>
          <div className="diploma-making-form__student-data__items-wrapper">
            {students && 
              <TagsInput
                selectedTags={(names) => setStudents(names.map(name => ({ name, email: '', verificationCode: generateVerificationCode() })))}
                tags={students.map(student => student.name)}
                setPage={(idx: number) => setSelectedStudentIndex(idx)}
              />
            }
            <div className="diploma-making-form__upload--fileupload-wrapper">
              {AllTrackData && 
                <FileUpload FileHandler={handleFileUpload} attachedFile={attachedFiles[AllTrackData[TrackIndex].bootcamps[BootcampIndex].guidId]} />
              }
            </div>
          </div>
        </div>

        <div className="pdf-generation-options">
          <div className="diploma-making-form__checkboxes">
            <label htmlFor="upload" className="diploma-making-form__label diploma-making-form__label--mb">
              PDF-Generation options
            </label>
            <div className="diploma-making-form__checkbox-group">
              <CheckboxGroup items={[
                { 
                  icon: <UpdateIcon />, 
                  label: 'Update changes made to Bootcamp', 
                  validationOptions: { ...register("optionA") }
                },
                { 
                  icon: <OpenIcon />, 
                  label: 'Open PDFs after generating', 
                  validationOptions: { ...register("optionB") }
                }
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
                    label: 'Generate PDFs for selected bootcamp',
                    validationOptions: { ...register("pdfGenerationScope", { required: true }), value: 'all' }
                  },
                  {
                    label: 'Generate PDF for selected student',
                    validationOptions: { ...register("pdfGenerationScope", { required: true }), value: 'selected' }
                  }
                ]}
                scope="pdfGenerationScope"
                defaultChecked={0}
              />
            </div>
          </div>
        </div>
        
        <div className="diploma-making-form__submit-group">
          <PublishButton classNameOverride="diploma-making-form__submit-button" text='Submit' onClick={() => {}} />
        </div>
      </form>
      <div className={`diploma-making__block-navbar ${disableNavbar ? 'active' : ''}`}></div>
    </>
  );
}