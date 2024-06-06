import './App.css'
import {Routes, Route, } from "react-router-dom";
import DiplimaMaking from './pages/DiplomaMaking';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DiplimaMaking/>} />
      </Routes>
    </div>
  );
}

export default App;
