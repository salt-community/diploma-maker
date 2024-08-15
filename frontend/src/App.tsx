import {Routes, Route, } from "react-router-dom";
import DiplomaMaking from './pages/Diplomaking/DiplomaMaking';
import { VertificationPage } from "./pages/Verifcation/VerificationPage";
import { useEffect, useState } from "react";
import { BootcampRequest, BootcampResponse, StudentUpdateRequestDto, EmailSendRequest, TemplateRequest, TemplateResponse, FormDataUpdateRequest, TrackResponse, MakeActiveSnapshotRequestDto, StudentResponse, Student } from "./util/types";
import { OverviewPage } from "./pages/Overview/OverviewPage";
import { NavBar } from "./pages/shared/Navbar/Navbar";
import BootcampManagement from "./pages/BootcampManagement/BootcampManagement";
import { TemplateCreatorPage } from "./pages/TemplateCreator/TemplateCreatorPage";
import { useLoadingMessage } from "./components/Contexts/LoadingMessageContext";
import { initApiEndpoints } from "./services/apiFactory";
import { VerificationInputPage } from "./pages/Verifcation/VerificationInputPage";
import { set } from "react-hook-form";
import { HistoryPage } from "./pages/History/HistoryPage";
import {HomePage} from "./pages/Homepage/HomePage"
import { Footer } from "./components/Footer/Footer";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import { generatePreviewImages } from "./util/helper";

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

  const updateStudentThumbnails = async (pdfs: Uint8Array[], studentsInput: Student[], setLoadingMessageAndAlert: (message: string) => void): Promise<void> => {
    const studentImageResponse: StudentResponse[] = await generatePreviewImages(pdfs, studentsInput, setLoadingMessageAndAlert);
    setBootcamps(prevBootcamps =>
      prevBootcamps!.map(bootcamp => ({
        ...bootcamp,
        students: bootcamp.students.map(student => {
          const matchingImage = studentImageResponse.find(
            preview => preview.guidId === student.guidId
          );
          return matchingImage
            ? {
                ...student,
                previewImageUrl: matchingImage.previewImageUrl,
                previewImageLQIPUrl: matchingImage.previewImageLQIPUrl,
              }
            : student;
        }),
      }))
    );
  }

  const UpdateBootcampWithNewFormdata = async (updateFormDataRequest: FormDataUpdateRequest, guidid: string): Promise<BootcampResponse> => {
    const bootcampResponse: BootcampResponse = await api.UpdateBootcampWithNewFormdata(updateFormDataRequest, guidid);
    if (bootcampResponse) {
      setBootcamps(prevbootcamps =>
        prevbootcamps!.map((item) => 
          item.guidId === guidid
            ? { ...item, students: bootcampResponse.students, templateId: bootcampResponse.templateId } as BootcampResponse
            : item
        )
      );
    }
    return bootcampResponse;
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
    const historySnapshots = await api.getHistorySnapshots(setLoadingMessage);
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
    getTracks();
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path={"/pdf-creator"} element={<DiplomaMaking tracks={tracks} templates={templates} UpdateBootcampWithNewFormdata={UpdateBootcampWithNewFormdata} updateStudentThumbnails={updateStudentThumbnails} setLoadingMessage={setLoadingMessage}/>} />
        <Route path={"/"} element={<HomePage/>} />
        <Route path={"/home"} element={<HomePage/>} />      
        {/*    <Route path={"/:selectedBootcamp"} element={<DiplomaMaking bootcamps={bootcamps!} templates={templates} UpdateBootcampWithNewFormdata={UpdateBootcampWithNewFormdata} />} /> */}
        <Route path={`/verify`} element={<VerificationInputPage />} />
        <Route path={`/verify/:verificationCode`} element = {<VertificationPage getHistoryByVerificationCode={getHistoryByVerificationCode}/>} />
        <Route path={"/bootcamp-management"} element= {<BootcampManagement bootcamps={bootcamps} deleteBootcamp={deleteBootcamp} addNewBootcamp={addNewBootcamp} updateBootcamp={updateBootcamp} tracks={tracks}/>} /> 
        <Route path={"/overview"} element={<OverviewPage bootcamps={bootcamps} deleteStudent={deleteStudent} updateStudentInformation={updateStudentInformation} sendEmail={sendEmail} templates={templates} setLoadingMessage={setLoadingMessage}/>} />
        <Route path={"/template-creator"} element={<TemplateCreatorPage templates={templates} addNewTemplate={addNewTemplate} updateTemplate={updateTemplate} deleteTemplate={deleteTemplate}/>} />
        <Route path={"/history"} element={<HistoryPage getHistory={getHistory} changeActiveHistorySnapShot={changeActiveHistorySnapShot} tracks={tracks}/>} />
        <Route path={"*"} element={<ErrorPage code={404} />} /> 
        </Routes>
      <Footer/> 
    </>
  );
}