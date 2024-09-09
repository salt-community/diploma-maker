import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TemplateResponse, SaltData, Student, FormDataUpdateRequest, TrackResponse, BootcampResponse, pdfGenerationResponse, BootcampRequest } from "../../../util/types";
import { FileUpload } from "../../MenuItems/Inputs/FileUploader";
import { ParseFileData } from '../../../services/InputFileService';
import './DiplomaDataForm.css';
import { AlertPopup } from "../../MenuItems/Popups/AlertPopup";
import { Template } from "@pdfme/common";
import { mapBootcampToSaltData2, mapTemplateInputsBootcampsToTemplateViewer, templateInputsFromBootcampData } from "../../../util/dataHelpers";
import { SelectOptions } from "../../MenuItems/Inputs/SelectOptions";
import { CheckboxGroup } from "../../MenuItems/Inputs/CheckBoxGroup";
import { UpdateIcon } from "../../MenuItems/Icons/UpdateIcon";
import { OpenIcon } from "../../MenuItems/Icons/OpenIcon";
import { ExclusiveCheckBoxGroup } from "../../MenuItems/Inputs/ExclusiveCheckBoxGroup";
import { PublishButton } from "../../MenuItems/Buttons/PublishButton";
import { TagsInput } from "../../TagsInput/TagsInput";
import { SaveButton } from "../../MenuItems/Buttons/SaveButton";
import { useCustomAlert } from "../../Hooks/useCustomAlert";
import { newGenerateAndDownloadZippedPDFs, newGenerateAndPrintCombinedPDF, newGenerateCombinedPDF } from "../../../util/pdfGenerationUtil";
import { downloadZipFile, openPrintWindowfromBlob, openWindowfromBlob } from "../../../util/fileActionUtil";
import { generateVerificationCode } from "../../../util/generateUtil";
import AddNewBootcampForm from "../../Forms/AddNewBootcampForm";
import { AddIcon } from "../../MenuItems/Icons/AddIcon";
import { ZipIcon } from "../../MenuItems/Icons/ZipIcon";
import { PrintIcon } from "../../MenuItems/Icons/PrintIcon";
import { useParams } from "react-router-dom";

type FormData = {
  optionA: boolean;
  optionB: boolean;
  optionC: boolean;
  pdfGenerationScope: 'all' | 'selected';
}

type Props = {
  UpdateBootcampWithNewFormdata: (updateFormDataRequest: FormDataUpdateRequest, guidid: string) => Promise<BootcampResponse>
  setSaltData: (data: SaltData) => void;
  templates: TemplateResponse[] | null;
  tracks: TrackResponse[];
  setLoadingMessage: (message: string) => void;
  selectedStudentIndex: number | null;
  setSelectedStudentIndex: (idx: number) => void;
  updateStudentThumbnails: (pdfs: Uint8Array[], studentsInput: Student[], setLoadingMessageAndAlert: (message: string) => void) => Promise<void>;
  addNewBootcamp: (bootcamp: BootcampRequest) => Promise<void>;
};

export default function DiplomaDataForm({ setSaltData, tracks, templates, UpdateBootcampWithNewFormdata, setLoadingMessage, selectedStudentIndex, setSelectedStudentIndex, updateStudentThumbnails, addNewBootcamp }: Props) {
  const { track, bootcamp } = useParams<{ track: string; bootcamp: string }>();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  const [AllTrackData, setAllTrackData] = useState<TrackResponse[]>();
  const [TrackIndex, setTrackIndex] = useState<number>(0);
  const [BootcampIndex, setBootcampIndex] = useState<number>(0);
  const [students, setStudents] = useState<Student[]>();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateResponse>();
  const [attachedFiles, setAttachedFiles] = useState<{ [key: string]: File | null }>({});
  const [disableNavbar, setDisableNavbar] = useState<boolean>(false);
  const [showAddBootcampForm, setShowAddBootcampForm] = useState<boolean>(false);
  const [addedBootcamp, setAddedBootcamp] = useState<BootcampRequest>()

  const { showPopup, popupContent, popupType, customAlert, closeAlert } = useCustomAlert();

  // Styling for generate popup btn
  const [printActive, setPrintActive] = useState<boolean>(false);
  const [downloadActive, setDownloadActive] = useState<boolean>(false);
  const [generateBtnActive, setGenerateBtnActive] = useState<boolean>(false);
  
  useEffect(() => {
    track && setTrackIndex(parseInt(track))
    bootcamp && setBootcampIndex(parseInt(bootcamp))
  }, [track, bootcamp])

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
      if (tracks && templates) {
          const filteredTracks = tracks.filter(t => t.bootcamps.length > 0);
          setAllTrackData(filteredTracks);
          if (TrackIndex >= filteredTracks.length) {
            setTrackIndex(0);
          }
          if (filteredTracks[TrackIndex]?.bootcamps?.length > 0 && BootcampIndex >= filteredTracks[TrackIndex].bootcamps.length) {
            setBootcampIndex(0);
          }
          if(addedBootcamp && tracks){
            // const addedBootcampIndex = AllTrackData[TrackIndex].bootcamps.findIndex(b => b.guidId === addedBootcamp.guidId);
            // addedBootcampIndex && setBootcampIndex(addedBootcampIndex);
            setTrackIndex(addedBootcamp.trackId - 1);
            
          }
      }
      
  }, [tracks, templates]);

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
    const dataFromFile = await ParseFileData(file, null, customAlert);
    const updatedStudents = dataFromFile.map(student => ({
      ...student,
      verificationCode: generateVerificationCode(tracks)
    }));
    setStudents(updatedStudents);

    const bootcampGuid = AllTrackData[TrackIndex].bootcamps[BootcampIndex].guidId;
    setAttachedFiles({ ...attachedFiles, [bootcampGuid]: file });
  };

  const postSelectedBootcampData = async (both?: Boolean): Promise<BootcampResponse> => {
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
      const response: BootcampResponse = await UpdateBootcampWithNewFormdata(updateFormDataRequest, AllTrackData[TrackIndex].bootcamps[BootcampIndex].guidId);
      both
        ? ''
        : customAlert('success', "Diplomas added successfully.", "Successfully added diplomas to the database.");

        setDisableNavbar(false);
      return response;
    } catch (error) {
      customAlert('fail', "Failed to add diplomas:", `${error}`);
      setDisableNavbar(false);
    }
  }

  const generatePDFHandler = async (pdfGenerationScope: 'all' | 'selected', print?: boolean, download?: boolean, bootcampPutResponse?: BootcampResponse) => {
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

    const studentsInput = bootcampPutResponse.students.filter(s => students.some(st => st.name === s.name));
    let pdfs: pdfGenerationResponse;

    try {
      pdfs = 
        print ? await newGenerateAndPrintCombinedPDF(templatesArr, inputsArray, setLoadingMessageAndAlert) 
        : download ? await newGenerateAndDownloadZippedPDFs(templatesArr, inputsArray, setLoadingMessageAndAlert)
        : await newGenerateCombinedPDF(templatesArr, inputsArray, setLoadingMessageAndAlert)
    } catch (error) {
      customAlert('fail', "Failed to generate pdfs", `${error}`);
    }

    updateStudentThumbnails(pdfs.pdfFiles, studentsInput, setLoadingMessageAndAlert); //Background task

    customAlert('loadingfadeout', '', '');
    await alertSuccess();
    
    print ? await openPrintWindowfromBlob(pdfs.bundledPdfsDisplayObject) :
    download ? await downloadZipFile(pdfs.bundledPdfsDisplayObject, selectedBootcamp.name)
    : await openWindowfromBlob(pdfs.bundledPdfsDisplayObject) 
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

  const onSubmit = async (data: FormData) => {
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

    let bootcampPutResponse;

    if (data.optionA && data.optionB) {
      bootcampPutResponse = await postSelectedBootcampData(true);
      data.optionB && !printActive && !downloadActive && await generatePDFHandler(data.pdfGenerationScope, false, false, bootcampPutResponse)
      data.optionB && printActive && !downloadActive && await generatePDFHandler(data.pdfGenerationScope, true, false, bootcampPutResponse)
      data.optionB && ! printActive && downloadActive && await generatePDFHandler(data.pdfGenerationScope, false, true, bootcampPutResponse)

    } else if (data.optionA) {
      bootcampPutResponse = await postSelectedBootcampData();
    }
  };

  const addNewBootcampHandler = async (bootcamp: BootcampRequest) => {
    customAlert('loading', "Adding New Bootcamp...", ``);
    try {
      setAddedBootcamp(bootcamp);
      await addNewBootcamp(bootcamp);
      customAlert('success', "Added Bootcamp Successfully.", `Successfully added bootcamp to the database.`);
    } catch (error) {
      customAlert('fail', "Error Adding Bootcamp", `${error}`);
    }
  }

  return (
    <>
      <div className={`diploma-making__add-bootcamp-form ${showAddBootcampForm ? ' visible' : ''}`}>
        <AddNewBootcampForm addNewBootcamp={addNewBootcampHandler} bootcamps={tracks.flatMap(t => t.bootcamps)} tracks={tracks} enableClose={true} onClick={() => setShowAddBootcampForm(false)}/>
      </div>
      <AlertPopup title={popupContent[0]} text={popupContent[1]} popupType={popupType} show={showPopup} onClose={closeAlert} durationOverride={3500} />
      <form className="diploma-making-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="diploma-making-form__select-track diploma-making-form__select-container">
          <label htmlFor="track" className="diploma-making-form__label">
            Track
          </label>
          {AllTrackData && 
            <SelectOptions
              containerClassOverride='overview-page__select-container'
              selectClassOverride='overview-page__select-box'
              value={TrackIndex.toString()}
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
              value={AllTrackData[TrackIndex]?.bootcamps[BootcampIndex]?.guidId || ''}
            />
          }
          <SaveButton 
            classNameOverride='diploma-making-form__addbootcamp-btn'
            saveButtonType='normal' 
            textfield="Add New" 
            customIcon={
              <AddIcon />
            } 
            type='button'
            onClick={() => setShowAddBootcampForm(true)}
          />
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
                selectedTags={(names) => setStudents(names.map(name => ({ name, email: '', verificationCode: generateVerificationCode(tracks) })))}
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
                  label: 'Update changes to cloud', 
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
                    label: 'Generate for selected bootcamp',
                    validationOptions: { ...register("pdfGenerationScope", { required: true }), value: 'all' }
                  },
                  {
                    label: 'Generate for selected student',
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
              specialCreateDiplomasBtn={true}
            />
            <SaveButton 
              classNameOverride={`diploma-making-form__print-button ${generateBtnActive && 'active'}`}
              onClick={() => setPrintActive(true)} 
              saveButtonType='grandTheftAuto' 
              textfield="" 
              customIcon={ <PrintIcon />}
              onMouseEnter={() => {setGenerateBtnActive(true); setPrintActive(true)}}
              onMouseLeave={() => {setGenerateBtnActive(true); setPrintActive(false); setGenerateBtnActive(false)}}
            />
            <SaveButton 
              classNameOverride={`diploma-making-form__download-button ${generateBtnActive && 'active'}`}
              onClick={() => {setDownloadActive(true)}} 
              saveButtonType='grandTheftAuto' 
              textfield=""
              customIcon={<ZipIcon />}
              onMouseEnter={() => {setGenerateBtnActive(true); setDownloadActive(true)}}
              onMouseLeave={() => {setGenerateBtnActive(true); setDownloadActive(false); setGenerateBtnActive(false)}}
            />
          </div>
        </div>
      </form>
      <div className={`diploma-making__block-navbar ${disableNavbar ? 'active' : ''}`}></div>
    </>
  );
}