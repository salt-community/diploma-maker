import React from 'react';
import PDFfile from "./components/PDFfile.tsx";
import { PDFViewer } from '@react-pdf/renderer';
import './App.css'

function App() {
  return (
    <div className="App">
      <nav></nav>
    
      <section className="PDFView"><h1>Preview PDF</h1>
      <PDFViewer width={500} height={750} showToolbar={false}>
        <PDFfile />
      </PDFViewer>
      </section>
      <section className="Input">
        <h2>Form section</h2>   
      </section>
    </div>
  );
}

export default App;
