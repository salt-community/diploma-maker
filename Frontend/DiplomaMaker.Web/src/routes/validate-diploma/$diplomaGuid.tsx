import { createFileRoute, useNavigate } from '@tanstack/react-router'
import HistoricDiplomaViewer from '@/components/diploma-viewer/HistoricDiplomaViewer';
import { PageLayout } from '@/components/layout';

export const Route = createFileRoute('/validate-diploma/$diplomaGuid')({
  component: Page,
})

function Page() {
  const { diplomaGuid } = Route.useParams();
  const navigate = useNavigate();

  console.log(diplomaGuid);

  return (
    <PageLayout>
      <HistoricDiplomaViewer diplomaGuid={diplomaGuid} />
    </PageLayout>
  );
}
