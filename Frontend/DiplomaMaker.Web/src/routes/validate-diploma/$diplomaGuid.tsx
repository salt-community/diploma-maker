import { createFileRoute } from '@tanstack/react-router'

import { PageLayout } from '@/components/layout';
import { HistoricDiplomaViewer } from '@/components/diploma-viewer';

//TODO: give feedback if diploma could not be validated

export const Route = createFileRoute('/validate-diploma/$diplomaGuid')({
  component: Page,
})

function Page() {
  const { diplomaGuid } = Route.useParams();
  // const navigate = useNavigate();

  console.log(diplomaGuid);

  return (
    <PageLayout>
      <HistoricDiplomaViewer diplomaGuid={diplomaGuid} />
    </PageLayout>
  );
}
