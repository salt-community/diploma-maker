import { FileUploader } from "react-drag-drop-files";
import { FileService } from "../../services";

const fileTypes = ["JSON"];

export default function DragAndDropFileParser() {
    const handleChange = async (file: any) => {
        try {
            const bootcamp = await FileService.parseJsonFileIntoBootcamp(file);
            console.log(bootcamp);
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    return (
        <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
    );
}