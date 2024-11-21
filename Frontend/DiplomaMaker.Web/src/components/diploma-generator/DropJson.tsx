import { FileService } from "@/services";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JSON"];

export function DropJson() {
    const handleChange = async (file: File) => {
        const bootcamp = await FileService.parseJsonFileIntoBootcamp(file);
        console.log(bootcamp);
    };

    return (
        // This component causes an error in the devconsole
        <FileUploader onChange={handleChange} multiple={true} label={"Drop Json file"} types={fileTypes} />
    );
}
