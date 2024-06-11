import {Routes, Route, } from "react-router-dom";
import DiplomaMaking from './pages/DiplomaMaking';
import { VertificationPage } from "./pages/VerificationPage";
import { OverviewPage } from "./pages/OverviewPage";

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<DiplomaMaking/>} />
        <Route path={`/:guidId`} element = {<VertificationPage />} />
        <Route path={"/overview"} element={<OverviewPage />} />
      </Routes>
  );
}

export default App;
