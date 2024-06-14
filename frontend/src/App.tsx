import {Routes, Route, } from "react-router-dom";
import DiplomaMaking from './pages/DiplomaMaking';
import { VertificationPage } from "./pages/VerificationPage";
import { useState } from "react";
import { BootcampResponse } from "./util/types";
import { deleteBootcampById, getBootcamps } from "./services/bootcampService";
import { OverviewPage } from "./pages/OverviewPage";
import { NavBar } from "./pages/shared/Navbar";
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

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<DiplomaMaking bootcamps={bootcamps!} deleteBootcamp={deleteBootcamp}/>} />
        <Route path="/:selectedBootcamp" element={<DiplomaMaking bootcamps={bootcamps!} deleteBootcamp={deleteBootcamp}/>} />
        <Route path={`/:guidId`} element = {<VertificationPage />} />
        <Route path={"/overview"} element={<OverviewPage bootcamps={bootcamps} deleteDiploma={deleteDiploma}/>} />
      </Routes>
    </>
  );
}

export default App;
