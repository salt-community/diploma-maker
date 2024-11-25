import { StringService } from "@/services";
import type { BackendTypes } from '@/services';
import { useCache, useEntity, useModal } from "@/hooks";

import { HistoricDiplomaViewer } from "@/components/diploma-viewer";
import { Modal } from "@/components";

export default function DiplomaHistory() {
    const { entities: diplomas } = useEntity<BackendTypes.DiplomaRecord>("DiplomaRecord", true);
    const { open: openHistoricDiplomaViewerModal } = useModal(import.meta.env.VITE_HISTORIC_DIPLOMA_VIEWER_MODAL_ID);
    const [diplomaGuid, setDiplomaGuid] = useCache<string>(["SelectedDiplomaGuid"]);

    const header = (
        <thead>
            <tr>
                {
                    ['Student Name', 'Student Email', 'Track', 'Graduation Date', ''].map(title =>
                        <th key={title}>{title}</th>
                    )}
            </tr>
        </thead>);

    const rows = diplomas.map(diploma => (
        <tr key={diploma.guid}>
            <td>{diploma.studentName}</td>
            <td>{diploma.studentEmail}</td>
            <td>{diploma.track}</td>
            <td>{StringService.formatDate_YYYY_mm_dd(diploma.graduationDate)}</td>
            <td>
                <button
                    className="btn"
                    onClick={() => {
                        setDiplomaGuid(diploma.guid!);
                        openHistoricDiplomaViewerModal();
                    }}>
                    Preview Diploma
                </button>
            </td>
        </tr>
    ));

    return (
        <>
            <div className="overflow-x-auto">
                <table className="table">
                    {header}
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>

            <Modal id={import.meta.env.VITE_HISTORIC_DIPLOMA_VIEWER_MODAL_ID} title="Historic Diploma">
                {diplomaGuid &&
                    <HistoricDiplomaViewer diplomaGuid={diplomaGuid} />
                }
            </Modal>
        </>
    );
}