import { createFileRoute, useNavigate } from '@tanstack/react-router'
import HistoricDiplomaViewer from '@/components/diploma-viewer/HistoricDiplomaViewer';

export const Route = createFileRoute('/validate-diploma/$diplomaGuid')({
  component: Page,
})

function Page() {
  const { diplomaGuid } = Route.useParams();
  const navigate = useNavigate();

  console.log(diplomaGuid);

  return (
    <>
      <HistoricDiplomaViewer diplomaGuid={diplomaGuid} />
    </>
  );
}
