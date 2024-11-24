import { createFileRoute } from '@tanstack/react-router'
import { useCache, useHistoricDiploma } from '@/hooks';
import { StringService } from '@/services';
import HistoricDiplomaViewer from '@/components/diploma-viewer/HistoricDiplomaViewer';
import { PageLayout } from '@/components/layout';

export const Route = createFileRoute('/history')({
  component: Page,
})

function Page() {
  const { diplomas } = useHistoricDiploma();
  const [diplomaGuid, setDiplomaGuid] = useCache<string>(["SelectedDiplomaGuid"]);

  const headerTitles = ['Student Name', 'Student Email', 'Track', 'Graduation Date', ''];
  const header = (
    <thead>
      <tr>{headerTitles.map(title => <th key={title}>{title}</th>)}</tr>
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
          }}>
          Preview Diploma
        </button>
      </td>
    </tr>
  ));

  return (<PageLayout>
    <div className="overflow-x-auto">
      <table className="table">
        {header}
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
    {diplomaGuid &&
      <HistoricDiplomaViewer diplomaGuid={diplomaGuid} />
    }
  </PageLayout>);
}
