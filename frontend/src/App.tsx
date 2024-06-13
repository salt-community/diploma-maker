import {Routes, Route, } from "react-router-dom";
import DiplomaMaking from './pages/DiplomaMaking';
import { VertificationPage } from "./pages/VerificationPage";
import { useState } from "react";
import { BootcampRequest, BootcampResponse } from "./util/types";
import { deleteBootcampById, getBootcamps, postBootcamp } from "./services/bootcampService";
import { OverviewPage } from "./pages/OverviewPage";
import { NavBar } from "./pages/shared/Navbar";
import BootcampManagement from "./pages/BootcampManagement";

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
    const newBootcamps = await getBootcamps();
    setBootcamps(newBootcamps);
  }

  async function addNewBootcamp(bootcamp: BootcampRequest){
    await postBootcamp(bootcamp);
    const newBootcamps = await getBootcamps();
    setBootcamps(newBootcamps);
  }

  async function updateBootcamp(bootcamp: BootcampRequest){
    await updateBootcamp(bootcamp);
    const newBootcamps = await getBootcamps();
    setBootcamps(newBootcamps);
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<DiplomaMaking bootcamps={bootcamps!} deleteBootcamp={deleteBootcamp} addNewBootcamp= {addNewBootcamp}/>} />
        <Route path={`/:guidId`} element = {<VertificationPage />} />
        <Route path={"/overview"} element={<OverviewPage />} />
        <Route path="/bootcamp-management" element= {<BootcampManagement bootcamps={bootcamps} deleteBootcamp={deleteBootcamp} addNewBootcamp={addNewBootcamp} updateBootcamp={updateBootcamp}/>} /> 
      </Routes>
    </>
  );
}

export default App;
