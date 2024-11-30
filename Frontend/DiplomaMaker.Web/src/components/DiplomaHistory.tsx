import { useCache, useEntity, useModal } from "@/hooks";
import type { BackendTypes } from "@/services";
import { DiplomaService, StringService } from "@/services";

import { HistoricDiplomaViewer } from "@/features/diploma-viewer";
import Modal from "./Modal";

export default function DiplomaHistory() {
  const { entities: diplomas } = useEntity<BackendTypes.DiplomaRecord>(
    "DiplomaRecord",
    true,
  );

  const {
    isOpen: isDiplomaViewerModalOpen,
    open: openDiplomaViewerModal,
    close: closeDiplomaViewerModal,
  } = useModal();

  const [diplomaGuid, setDiplomaGuid] = useCache<string>([
    "SelectedDiplomaGuid",
  ]);

  const diplomaGroups = DiplomaService.groupDiplomas(diplomas);

  const header = (
    <thead>
      <tr>
        {["Student Name", "Student Email", ""].map((title) => (
          <th key={title}>{title}</th>
        ))}
      </tr>
    </thead>
  );

  function diplomaGroupTable(diplomaGroup: BackendTypes.DiplomaRecord[]) {
    return (
      <div className="overflow-x-auto">
        <table className="table">
          {header}
          <tbody>
            {diplomaGroup.map((diploma) => (
              <tr key={diploma.guid}>
                <td>{diploma.studentName}</td>
                <td>{diploma.studentEmail}</td>
                <td>
                  <button
                    className="btn"
                    onClick={() => {
                      setDiplomaGuid(diploma.guid!);
                      openDiplomaViewerModal();
                    }}
                  >
                    Show Diploma
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function diplomaGroupAccordion(diplomaGroup: BackendTypes.DiplomaRecord[]) {
    const accordionTitle = (
      <div className="flex flex-row justify-between">
        <h2>{`${diplomaGroup[0].track}`}</h2>
        <p>{`${diplomaGroup.length} Students`}</p>
        <p>{`${StringService.formatDate_YYYY_mm_dd(diplomaGroup[0].graduationDate)}`}</p>
      </div>
    );

    return (
      <div
        key={diplomaGroup[0].graduationDate.toString()}
        className="collapse collapse-arrow bg-base-200"
      >
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-xl font-medium">
          {accordionTitle}
        </div>
        <div className="collapse-content">
          {diplomaGroupTable(diplomaGroup)}
        </div>
      </div>
    );
  }

  return (
    <>
      {diplomaGroups.map((group) => diplomaGroupAccordion(group))}

      <Modal
        isOpen={isDiplomaViewerModalOpen}
        onClose={closeDiplomaViewerModal}
        panelClass="flex flex-col sm:max-w-screen-md"
      >
        <div className="pb-6">
          <h3 className="font-display text-lg font-bold">Diploma</h3>
          <button
            onClick={closeDiplomaViewerModal}
            className="btn btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </div>
        {diplomaGuid && (
          <HistoricDiplomaViewer
            className="flex-1 overflow-y-hidden"
            diplomaGuid={diplomaGuid}
          />
        )}
      </Modal>
    </>
  );
}
