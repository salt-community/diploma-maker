import PDFfile from "../components/PDFfile.tsx";
import { PDFViewer } from "@react-pdf/renderer";

export default function PDFGenerator({names} : Props) {
  return (
    <>
      <section className="PDFView">
        <h1>Preview PDF {names} </h1>
        <PDFViewer width={500} height={750} showToolbar={false}>
          <PDFfile />
        </PDFViewer>
      </section>
    </>
  );
}

type Props = {
  names : string[]
}
