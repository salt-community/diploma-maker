import { FileService } from "@/services";
import { Bootcamp } from "@/services/fileService";

interface Props {
    onDrop: (bootcamp: Bootcamp) => void
}

export function UploadJson({ onDrop }: Props) {
    const handleChange = async (file?: File) => {
        if (!file)
            throw new Error("File is undefined");

        onDrop(await FileService.parseJsonFileIntoBootcamp(file));
    };

    return (
        <label className="form-control w-full max-w-xs">
            <div className="label">
                <span className="label-text">Pick a bootcamp .json file</span>
            </div>

            <input
                className="file-input file-input-bordered w-full max-w-xs"
                type="file"
                accept="application/json"
                onChange={(e) => handleChange(e.target.files?.[0])} />
        </label>
    );
}
