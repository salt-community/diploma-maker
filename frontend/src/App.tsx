import {Routes, Route, } from "react-router-dom";
import DiplomaMaking from './pages/Diplomaking/DiplomaMaking';
import { VertificationPage } from "./pages/Verifcation/VerificationPage";
import { useEffect, useState } from "react";
import { BootcampRequest, BootcampResponse, StudentResponse, StudentUpdateRequestDto, StudentsRequestDto, EmailSendRequest, TemplateRequest, TemplateResponse } from "./util/types";
import { deleteBootcampById, getBootcamps, postBootcamp, updateBootcamp as updateBootcampService } from "./services/bootcampService";
import { OverviewPage } from "./pages/Overview/OverviewPage";
import { NavBar } from "./pages/shared/Navbar/Navbar";
import BootcampManagement from "./pages/BootcampManagement/BootcampManagement";
import { deleteStudentById, postMultipleStudents, updateSingleStudent } from "./services/studentService";
import { TemplateCreatorPage } from "./pages/TemplateCreator/TemplateCreatorPage";
import { deleteTemplateById, getAllTemplates, postTemplate, putTemplate } from "./services/templateService";
import { postEmail } from "./services/emailService";

export default function App() {
  const [bootcamps, setBootcamps] = useState<BootcampResponse[] | null>(null);
  const [templates, setTemplates] = useState<TemplateResponse[] | null>(null);

  async function getBootcampsFromBackend() {
    const newBootcamps: BootcampResponse[] = await getBootcamps(); 
    setBootcamps(newBootcamps);
  }

  useEffect(() => {
    if(!bootcamps){
      getBootcampsFromBackend();
      getTemplates();
    }
  }, [bootcamps]);

  // bootcamps
  async function deleteBootcamp(i: number){
    const guid = bootcamps![i].guidId;
    await deleteBootcampById(guid);
    await refresh();
  }
  
  async function addNewBootcamp(bootcamp: BootcampRequest){
    await postBootcamp(bootcamp);
    await refresh();
  }
  
  async function updateBootcamp(bootcamp: BootcampRequest){
    await updateBootcampService(bootcamp);
    await refresh();
  }

  // students
  async function deleteStudent(id: string){
    await deleteStudentById(id);
    await refresh();
  }
  async function addMultipleStudents(studentsRequest: StudentsRequestDto): Promise<StudentResponse[]> {
    const response = await postMultipleStudents(studentsRequest);
    await refresh();
    return response;
  }
  
  async function updateStudentInformation(StudentRequest: StudentUpdateRequestDto){
      var StudentResponse = await updateSingleStudent(StudentRequest);
      await refresh();
      return StudentResponse
   }
   
  // templates
  async function getTemplates() {
    const templates: TemplateResponse[] = await getAllTemplates(); 
    setTemplates(templates);
  }

  async function addNewTemplate(template: TemplateRequest){
    await postTemplate(template);
    await refresh();
  }

  async function updateTemplate(id: number, templateRequest: TemplateRequest){
    var templateResponse = await putTemplate(id, templateRequest);
    await refresh();
    return templateResponse
  }

  async function deleteTemplate(id: number){
    await deleteTemplateById(id);
    await refresh();
  }
  // email
  async function sendEmail(emailRequest: EmailSendRequest){
    await postEmail(emailRequest)
  }

  async function refresh(){
    const newBootcamps = await getBootcamps();
    const newTemplates = await getAllTemplates();
    setBootcamps(newBootcamps);
    setTemplates(newTemplates);
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path={"/"} element={<DiplomaMaking bootcamps={bootcamps!} templates={templates} addMultipleStudents={addMultipleStudents}/>} />
        <Route path={"/:selectedBootcamp"} element={<DiplomaMaking bootcamps={bootcamps!} templates={templates} addMultipleStudents={addMultipleStudents}/>} />
        <Route path={`/:guidId`} element = {<VertificationPage />} />
        <Route path={"/bootcamp-management"} element= {<BootcampManagement bootcamps={bootcamps} deleteBootcamp={deleteBootcamp} addNewBootcamp={addNewBootcamp} updateBootcamp={updateBootcamp}/>} /> 
        <Route path={"/overview"} element={<OverviewPage bootcamps={bootcamps} deleteStudent={deleteStudent} updateStudentInformation={updateStudentInformation} sendEmail={sendEmail}/>} />
        <Route path={"/template-creator"} element={<TemplateCreatorPage templates={templates} addNewTemplate={addNewTemplate} updateTemplate={updateTemplate} deleteTemplate={deleteTemplate}/>} />
      </Routes>
    </>
  );
}