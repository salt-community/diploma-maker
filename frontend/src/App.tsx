import {Routes, Route, } from "react-router-dom";
import DiplomaMaking from './pages/DiplomaMaking';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<DiplomaMaking/>} />
      </Routes>
  );
}

export default App;
