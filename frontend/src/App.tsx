import './App.css'
import {Routes, Route, } from "react-router-dom";
import DiplomaMaking from './pages/DiplomaMaking.tsx';



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DiplomaMaking/>} />
      </Routes>
    </div>
  );
}

export default App;
