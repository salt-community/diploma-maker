import useGeneratePdfFromFullDiploma from "../hooks/useGeneratePdfFromFullDiploma";

export default function ValidateDiploma() {
    const { pdfLink } = useGeneratePdfFromFullDiploma("a31b353e-60b6-42b5-b03a-ba23df76e236");

    if (!pdfLink)
        return;

    console.log(pdfLink);

    return (
        <>
            <p>ValidateDiploma</p>
            <iframe
                src={pdfLink}
                className="h-96 w-full"
            ></iframe>
        </>
    );
}