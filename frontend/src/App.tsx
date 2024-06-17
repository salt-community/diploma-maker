import {Routes, Route, } from "react-router-dom";
import DiplomaMaking from './pages/DiplomaMaking';
import { VertificationPage } from "./pages/VerificationPage";
import { useState } from "react";
import { BootcampRequest, BootcampResponse, DiplomaRequest, DiplomaResponse, DiplomasRequestDto } from "./util/types";
import { deleteBootcampById, getBootcamps, postBootcamp, postMultipleDiplomas, updateBootcamp as updateBootcampService } from "./services/bootcampService";
import { OverviewPage } from "./pages/OverviewPage";
import { NavBar } from "./pages/shared/Navbar";
import BootcampManagement from "./pages/BootcampManagement";
import { deleteDiplomaById } from "./services/diplomaService";

function App() {
  const [bootcamps, setBootcamps] = useState<BootcampResponse[] | null>(null);

  async function getBootcampsFromBackend() {
    const newBootcamps: BootcampResponse[] = await getBootcamps(); 
    setBootcamps(newBootcamps);
  }

  if(!bootcamps){
    getBootcampsFromBackend();
  }

  async function deleteBootcamp(i: number){
    const guid = bootcamps![i].guidId;
    await deleteBootcampById(guid);
    await refresh();
  }

  async function deleteDiploma(id: string){
    await deleteDiplomaById(id);
    await refresh();
  }

  async function refresh(){
    const newBootcamps = await getBootcamps();
    setBootcamps(newBootcamps);
  }

  async function addNewBootcamp(bootcamp: BootcampRequest){
    await postBootcamp(bootcamp);
    const newBootcamps = await getBootcamps();
    setBootcamps(newBootcamps);
  }

  async function updateBootcamp(bootcamp: BootcampRequest){
    await updateBootcampService(bootcamp);
    const newBootcamps = await getBootcamps();
    setBootcamps(newBootcamps);
  }

  async function addMultipleDiplomas(diplomasRequest: DiplomasRequestDto): Promise<DiplomaResponse[]> {
    console.log(diplomasRequest);
    const response = await postMultipleDiplomas(diplomasRequest);
    await refresh();
    return response;
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<DiplomaMaking bootcamps={bootcamps!} addMultipleDiplomas={addMultipleDiplomas}/>} />
        <Route path="/:selectedBootcamp" element={<DiplomaMaking bootcamps={bootcamps!} addMultipleDiplomas={addMultipleDiplomas}/>} />
        <Route path={`/:guidId`} element = {<VertificationPage />} />
        <Route path="/bootcamp-management" element= {<BootcampManagement bootcamps={bootcamps} deleteBootcamp={deleteBootcamp} addNewBootcamp={addNewBootcamp} updateBootcamp={updateBootcamp}/>} /> 
        <Route path={"/overview"} element={<OverviewPage bootcamps={bootcamps} deleteDiploma={deleteDiploma}/>} />
      </Routes>
    </>
  );
}

export default App;
