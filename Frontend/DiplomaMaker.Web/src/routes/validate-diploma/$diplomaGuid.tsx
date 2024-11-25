import { createFileRoute } from '@tanstack/react-router'

import { PageLayout } from '@/components/layout';
import { HistoricDiplomaViewer } from '@/components/diploma-viewer';

export const Route = createFileRoute('/validate-diploma/$diplomaGuid')({
  component: Page,
})

function Page() {
  const { diplomaGuid } = Route.useParams();

  return (
    <PageLayout>
      <HistoricDiplomaViewer diplomaGuid={diplomaGuid} />
    </PageLayout>
  );
}
