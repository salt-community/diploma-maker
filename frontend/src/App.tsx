import {Routes, Route, } from "react-router-dom";
import DiplomaMaking from './pages/DiplomaMaking';
import { VertificationPage } from "./pages/VerificationPage";

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<DiplomaMaking/>} />
        <Route path={`/:guidId`} element = {<VertificationPage />} />
      </Routes>
  );
}

export default App;
