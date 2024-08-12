import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TemplateResponse, SaltData, Student, FormDataUpdateRequest, TrackResponse } from "../../../util/types";
import { FileUpload } from "../../MenuItems/Inputs/FileUploader";
import { ParseFileData } from '../../../services/InputFileService';
import { generateVerificationCode, mapBootcampToSaltData2, newGenerateAndDownloadZippedPDFs, newGenerateAndPrintCombinedPDF, newGenerateCombinedPDF } from "../../../util/helper";
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
import { SaveButton } from "../../MenuItems/Buttons/SaveButton";

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

  // Styling for generate popup btn
  const [printActive, setPrintActive] = useState<boolean>(false);
  const [downloadActive, setDownloadActive] = useState<boolean>(false);
  const [generateBtnActive, setGenerateBtnActive] = useState<boolean>(false);

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

  const generatePDFHandler = async (pdfGenerationScope: 'all' | 'selected', print?: boolean, download?: boolean) => {
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
      print 
      ? await newGenerateAndPrintCombinedPDF(templatesArr, inputsArray, setLoadingMessageAndAlert) 
      : download ? await newGenerateAndDownloadZippedPDFs(templatesArr, inputsArray,  AllTrackData[TrackIndex].name, setLoadingMessageAndAlert)
      : await newGenerateCombinedPDF(templatesArr, inputsArray, setLoadingMessageAndAlert) 
      
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
    if (data.optionB && printActive) {
      generatePDFHandler(data.pdfGenerationScope, true, false);
      setPrintActive(false);
    }
    
    if (data.optionB && downloadActive) {
      generatePDFHandler(data.pdfGenerationScope, false, true);
      setDownloadActive(false);
    }
    if (data.optionA && data.optionB) {
      postSelectedBootcampData(true);
    } else if (data.optionA) {
      postSelectedBootcampData();
    }
    if (data.optionB && !printActive && !downloadActive) {
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
          <div className="submit-group__btn-container">
            <PublishButton 
              classNameOverride={`diploma-making-form__submit-button ${downloadActive && 'active '} ${printActive && 'active '}`} 
              text='Generate' 
              onClick={() => {}} 
              onMouseEnter={() => {setGenerateBtnActive(true)}}
              onMouseLeave={() => {setGenerateBtnActive(false)}}
            />
            <SaveButton 
              classNameOverride={`diploma-making-form__print-button ${generateBtnActive && 'active'}`}
              onClick={() => setPrintActive(true)} saveButtonType='grandTheftAuto' 
              textfield="" 
              customIcon={
                <svg fill="#ababba" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ababba" stroke-width="0.00032" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>print</title> <path d="M5.656 6.938l-0.344 2.688h11.781l-0.344-2.688c0-0.813-0.656-1.438-1.469-1.438h-8.188c-0.813 0-1.438 0.625-1.438 1.438zM1.438 11.094h19.531c0.813 0 1.438 0.625 1.438 1.438v8.563c0 0.813-0.625 1.438-1.438 1.438h-2.656v3.969h-14.219v-3.969h-2.656c-0.813 0-1.438-0.625-1.438-1.438v-8.563c0-0.813 0.625-1.438 1.438-1.438zM16.875 25.063v-9.281h-11.344v9.281h11.344zM15.188 18.469h-8.125c-0.188 0-0.344-0.188-0.344-0.375v-0.438c0-0.188 0.156-0.344 0.344-0.344h8.125c0.188 0 0.375 0.156 0.375 0.344v0.438c0 0.188-0.188 0.375-0.375 0.375zM15.188 21.063h-8.125c-0.188 0-0.344-0.188-0.344-0.375v-0.438c0-0.188 0.156-0.344 0.344-0.344h8.125c0.188 0 0.375 0.156 0.375 0.344v0.438c0 0.188-0.188 0.375-0.375 0.375zM15.188 23.656h-8.125c-0.188 0-0.344-0.188-0.344-0.375v-0.438c0-0.188 0.156-0.344 0.344-0.344h8.125c0.188 0 0.375 0.156 0.375 0.344v0.438c0 0.188-0.188 0.375-0.375 0.375z"></path> </g></svg>
              }
              onMouseEnter={() => {setGenerateBtnActive(true); setPrintActive(true)}}
              onMouseLeave={() => {setGenerateBtnActive(true); setPrintActive(false)}}
            />
            <SaveButton 
              classNameOverride={`diploma-making-form__download-button ${generateBtnActive && 'active'}`}
              onClick={() => {setDownloadActive(true)}} 
              saveButtonType='grandTheftAuto' 
              textfield=""
              customIcon={
                <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#000000">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path fill="#ababba" d="M378.409,0H208.294h-13.176l-9.314,9.314L57.016,138.102l-9.314,9.314v13.176v265.514 c0,47.36,38.528,85.895,85.895,85.895h244.811c47.36,0,85.889-38.535,85.889-85.895V85.896C464.298,38.528,425.769,0,378.409,0z M432.493,426.105c0,29.877-24.214,54.091-54.084,54.091H133.598c-29.877,0-54.091-24.214-54.091-54.091V160.591h83.717 c24.885,0,45.07-20.178,45.07-45.07V31.804h170.115c29.87,0,54.084,24.214,54.084,54.092V426.105z"></path>
                      <path fill="#ababba" d="M207.466,276.147c4.755-6.926,5.841-9.782,5.841-13.853c0-5.166-3.534-9.509-10.46-9.509h-43.464 c-5.977,0-9.506,3.805-9.506,8.965c0,5.159,3.529,8.825,9.506,8.825h29.339v0.272l-33.958,50.119 c-4.615,6.661-6.382,9.915-6.382,14.669c0,5.167,3.666,9.51,10.46,9.51h44.959c6.109,0,9.506-3.666,9.506-8.826 c0-5.166-3.397-8.965-9.506-8.965h-30.834v-0.272L207.466,276.147z"></path>
                      <path fill="#ababba" d="M247.684,251.968c-5.841,0-10.051,4.21-10.051,10.592v72.804c0,6.388,4.21,10.599,10.051,10.599 c5.704,0,9.915-4.21,9.915-10.599V262.56C257.599,256.178,253.388,251.968,247.684,251.968z"></path>
                      <path fill="#ababba" d="M323.344,252.785h-28.523c-5.432,0-8.693,3.533-8.693,8.825v73.754c0,6.388,4.21,10.599,10.051,10.599 c5.704,0,9.914-4.21,9.914-10.599v-22.406c0-0.545,0.272-0.817,0.817-0.817h16.433c20.102,0,32.192-12.226,32.192-29.612 C355.535,264.871,343.582,252.785,323.344,252.785z M322.122,294.888h-15.211c-0.545,0-0.817-0.272-0.817-0.81v-23.23 c0-0.545,0.272-0.816,0.817-0.816h15.211c8.42,0,13.448,5.027,13.448,12.498C335.569,290,330.542,294.888,322.122,294.888z"></path>
                    </g>
                  </g>
              </svg>
              }
              onMouseEnter={() => {setGenerateBtnActive(true); setDownloadActive(true)}}
              onMouseLeave={() => {setGenerateBtnActive(true); setDownloadActive(false)}}
            />
          </div>
        </div>
      </form>
      <div className={`diploma-making__block-navbar ${disableNavbar ? 'active' : ''}`}></div>
    </>
  );
}