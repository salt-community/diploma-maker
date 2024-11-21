import { FileService } from "@/services";
import { Bootcamp } from "@/services/fileService";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JSON"];

interface Props {
    onDrop: (bootcamp: Bootcamp) => void
}

export function DropJson({ onDrop }: Props) {
    const handleChange = async (file: File) => {
        onDrop(await FileService.parseJsonFileIntoBootcamp(file));
    };

    return (
        // This component causes an error in the dev console
        <FileUploader handleChange={handleChange} label={"Drop Json file"} types={fileTypes} />
    );
}
