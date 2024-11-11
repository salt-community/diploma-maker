import { StringFile } from "../api/models";
import useEntity from "../hooks/useEntity";
import { FileService } from "../services";
import { MimeType } from "../types/types";

interface Props {
    mimeType: MimeType
}

export default function UploadFileForm({ mimeType }: Props) {
    const { postEntity } = useEntity<StringFile>("StringFile");

    const handleUploadedFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target?.files)
            throw new Error("Files are not defined");

        for (const file of event.target.files)
            postEntity({
                guid: '',
                mimeType,
                content: await FileService.readDataUrlFile(file),
                name: file.name
            });
    }

    return (
        <>
            <input
                className="file-input file-input-bordered w-full max-w-xs"
                type="file"
                accept={mimeType}
                onChange={handleUploadedFiles} />
        </>
    );
}