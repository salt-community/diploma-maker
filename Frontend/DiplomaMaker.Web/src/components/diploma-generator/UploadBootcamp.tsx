import { useCache } from "@/hooks";
import { BootcampTypes, FileService } from "@/services";
import { bootcampKey } from "./cacheKeys";

interface Props {
}

export default function UploadBootcamp({}: Props) {
    const [_, setBootcamp] = useCache<BootcampTypes.Bootcamp>(bootcampKey);

    const handleChange = async (file?: File) => {
        if (!file)
            throw new Error("File is undefined");

        setBootcamp(await FileService.parseJsonFileIntoBootcamp(file))
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
