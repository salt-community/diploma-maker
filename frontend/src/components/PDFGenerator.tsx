import PDFfile from "../components/PDFfile.tsx";
import { PDFViewer } from "@react-pdf/renderer";

export default function PDFGenerator() {
  return (
    <>
      <section className="PDFView">
        <h1>Preview PDF</h1>
        <PDFViewer width={500} height={750} showToolbar={false}>
          <PDFfile />
        </PDFViewer>
      </section>
      <section className="Input">
        <h2>Form section</h2>
      </section>
    </>
  );
}
