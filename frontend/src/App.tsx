import {Routes, Route, } from "react-router-dom";
import DiplimaMaking from './pages/DiplomaMaking';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<DiplimaMaking/>} />
      </Routes>
  );
}

export default App;
