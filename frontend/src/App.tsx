import {Routes, Route, } from "react-router-dom";
import DiplomaMaking from './pages/DiplomaMaking';
import { VertificationPage } from "./pages/VerificationPage";
import { useState } from "react";
import { BootcampResponse } from "./util/types";
import { getBootcamps } from "./services/bootcampService";



function App() {
  const [bootcamps, setBootcamps] = useState<BootcampResponse[] | null>(null);

  async function getBootcampsFromBackend() {
    const newBootcamps: BootcampResponse[] = await getBootcamps(); 
    setBootcamps(newBootcamps);
  }

  if(!bootcamps){
    getBootcampsFromBackend();
  }

  return (
    
      <Routes>
        <Route path="/" element={<DiplomaMaking bootcamps={bootcamps!}/>} />
        <Route path={`/:guidId`} element = {<VertificationPage />} />
      </Routes>
  );
}

export default App;
