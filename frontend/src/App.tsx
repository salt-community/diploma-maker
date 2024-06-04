import './App.css'
import {Routes, Route, } from "react-router-dom";
import PDFGenerator from './components/PDFGenerator.tsx';



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PDFGenerator/>} />
      </Routes>
    </div>
  );
}

export default App;
