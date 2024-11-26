import { BootcampTypes, FileService } from "@/services";
import { useCache } from "@/hooks";

import { bootcampKey } from "./cacheKeys";

export default function UploadBootcamp() {
    const [_, setBootcamp] = useCache<BootcampTypes.Bootcamp>(bootcampKey);

    const handleChange = async (file?: File) => {
        if (!file)
            throw new Error("File is undefined");

        setBootcamp(await FileService.parseJsonFileIntoBootcamp(file))
    };

    return (
        <label className="form-control w-full max-w-xs">
            <input
                className="file-input file-input-bordered w-full max-w-xs"
                type="file"
                accept="application/json"
                onChange={(e) => handleChange(e.target.files?.[0])} />
        </label>
    );
}
