import { StringFile } from "../fetchApi/types";
import useEntity from "../hooks/useEntity";
import UploadFileForm from "./UploadFileForm";

export default function FileManager() {
    const { entities, deleteEntity } = useEntity<StringFile>("StringFile");
    const files: StringFile[] = entities;

    const headerNames = ["Name", "Type", "Delete"];

    return (
        <>
            <UploadFileForm mimeType='application/pdf' />
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            {headerNames.map(header => <th key={header}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {files.map(file => (
                            <tr key={file.guid}>
                                <td>{file.name}</td>
                                <td>{file.mimeType}</td>
                                <td>
                                    <button
                                        className='btn'
                                        onClick={() => deleteEntity(file.guid!)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}