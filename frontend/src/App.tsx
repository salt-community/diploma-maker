import {Routes, Route, } from "react-router-dom";
import DiplomaMaking from './pages/Diplomaking/DiplomaMaking';
import { VertificationPage } from "./pages/Verifcation/VerificationPage";
import { useEffect, useState } from "react";
import { BootcampRequest, BootcampResponse, StudentUpdateRequestDto, EmailSendRequest, TemplateRequest, TemplateResponse, FormDataUpdateRequest, TrackResponse, MakeActiveSnapshotRequestDto } from "./util/types";
import { OverviewPage } from "./pages/Overview/OverviewPage";
import { NavBar } from "./pages/shared/Navbar/Navbar";
import BootcampManagement from "./pages/BootcampManagement/BootcampManagement";
import { TemplateCreatorPage } from "./pages/TemplateCreator/TemplateCreatorPage";
import { useLoadingMessage } from "./components/Contexts/LoadingMessageContext";
import { initApiEndpoints } from "./services/apiFactory";
import { VerificationInputPage } from "./pages/Verifcation/VerificationInputPage";
import { set } from "react-hook-form";
import { HistoryPage } from "./pages/History/HistoryPage";

const api = initApiEndpoints(import.meta.env.VITE_API_URL);

export default function App() {
  const [tracks, setTracks] = useState<TrackResponse[] | null>(null);
  const [bootcamps, setBootcamps] = useState<BootcampResponse[] | null>(null);
  const [templates, setTemplates] = useState<TemplateResponse[] | null>(null);

  const { setLoadingMessage, loadingMessage } = useLoadingMessage();

  async function getBootcampsFromBackend() {
    const newBootcamps: BootcampResponse[] = await api.getBootcamps(setLoadingMessage);
    setBootcamps(newBootcamps);
    const Tracks = await api.getAllTracks(setLoadingMessage)
    setTracks(Tracks)
  }

  useEffect(() => {
    if(!bootcamps){
      getBootcampsFromBackend();
      getTemplates();
      getTracks();
    }
  }, [bootcamps]);

  // Bootcamp Endpoint
  const deleteBootcamp = async (i: number) =>{
    const guid = bootcamps![i].guidId;
    await api.deleteBootcampById(guid);
    await refresh();
  }
  
  const addNewBootcamp = async (bootcamp: BootcampRequest) => {
    await api.postBootcamp(bootcamp);
    await refresh();
  }
  
  const updateBootcamp = async (bootcamp: BootcampRequest) =>{
    await api.updateBootcamp(bootcamp);
    await refresh();
  }
  const UpdateBootcampWithNewFormdata = async (updateFormDataRequest: FormDataUpdateRequest, guidid: string) => {
    const response = await api.UpdateBootcampWithNewFormdata(updateFormDataRequest, guidid);
    if (response) {
      setBootcamps(prevbootcamps =>
        prevbootcamps!.map((item) => 
          item.guidId === guidid
            ? { ...item, students: updateFormDataRequest.students, templateId: updateFormDataRequest.templateId} as BootcampResponse
            : item
        )
      );

    }
  };
  

  // Students Endpoint
  const deleteStudent = async (id: string) => {
    await api.deleteStudentById(id);
    await refresh();
  }
  
  const updateStudentInformation = async (StudentRequest: StudentUpdateRequestDto) => {
    var StudentResponse = await api.updateSingleStudent(StudentRequest);
    await refresh();
    return StudentResponse
  }

  const getStudentByVerificationCode = async (verificationCode: string) => {
    const studentResponse = api.getStudentByVerificationCode(verificationCode);
    return studentResponse;
  }
   
  // Templates Endpoint
  const getTemplates = async () => {
    const templates: TemplateResponse[] = await api.getAllTemplates(setLoadingMessage); 
    setTemplates(templates);
  }

  const addNewTemplate = async (template: TemplateRequest) => {
    await api.postTemplate(template);
    await refresh();
  }

  const updateTemplate = async (id: number, templateRequest: TemplateRequest) => {
    var templateResponse = await api.putTemplate(id, templateRequest);
    await refresh();
    return templateResponse
  }

  const deleteTemplate = async (id: number) => {
    await api.deleteTemplateById(id);
    await refresh();
  }

  // Email Endpoint
  const sendEmail = async (emailRequest: EmailSendRequest) => {
    await api.postEmail(emailRequest)
  }

  // HistorySnapshot Endpoint
  const getHistory = async () => {
    const historySnapshots = await api.getHistorySnapshots();
    return historySnapshots;
  }
  
  const getHistoryByVerificationCode = async (verificationCode: string) => {
    const historySnapshots = await api.getHistoryByVerificationCode(verificationCode);
    return historySnapshots;
  }

  const changeActiveHistorySnapShot = async (snapshotUpdateRequest: MakeActiveSnapshotRequestDto) => {
    await api.makeActiveHistorySnapShot(snapshotUpdateRequest);
  }

  // Tracks Endpoint
  const getTracks = async () => {
    const tracks = await api.getAllTracks(setLoadingMessage);
    setTracks(tracks);
  }

  const refresh = async () => {
    const newBootcamps = await api.getBootcamps(setLoadingMessage);
    const newTemplates = await api.getAllTemplates(setLoadingMessage);
    setBootcamps(newBootcamps);
    setTemplates(newTemplates);
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path={"/"} element={<DiplomaMaking tracks={tracks}templates={templates} UpdateBootcampWithNewFormdata={UpdateBootcampWithNewFormdata}/>} />
     {/*    <Route path={"/:selectedBootcamp"} element={<DiplomaMaking bootcamps={bootcamps!} templates={templates} UpdateBootcampWithNewFormdata={UpdateBootcampWithNewFormdata} />} /> */}
        <Route path={`/verify`} element={<VerificationInputPage />} />
        <Route path={`/verify/:verificationCode`} element = {<VertificationPage getHistoryByVerificationCode={getHistoryByVerificationCode}/>} />
        <Route path={"/bootcamp-management"} element= {<BootcampManagement bootcamps={bootcamps} deleteBootcamp={deleteBootcamp} addNewBootcamp={addNewBootcamp} updateBootcamp={updateBootcamp} tracks={tracks}/>} /> 
        <Route path={"/overview"} element={<OverviewPage bootcamps={bootcamps} deleteStudent={deleteStudent} updateStudentInformation={updateStudentInformation} sendEmail={sendEmail} templates={templates}/>} />
        <Route path={"/template-creator"} element={<TemplateCreatorPage templates={templates} addNewTemplate={addNewTemplate} updateTemplate={updateTemplate} deleteTemplate={deleteTemplate}/>} />
        <Route path={"/history"} element={<HistoryPage getHistory={getHistory} changeActiveHistorySnapShot={changeActiveHistorySnapShot}/>} />
      </Routes>
    </>
  );
}