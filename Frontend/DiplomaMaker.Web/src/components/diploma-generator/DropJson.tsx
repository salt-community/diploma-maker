import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JSON"];

export function DropJson() {
    const handleChange = (file: File) => {
        console.log(file);
    };
    
    return (
        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
    );
}
