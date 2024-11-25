import { createFileRoute } from '@tanstack/react-router'

import { HistoricDiplomaViewer } from '@/features/diploma-viewer';

export const Route = createFileRoute('/validate-diploma/$diplomaGuid')({
  component: Page,
})

function Page() {
  const { diplomaGuid } = Route.useParams();

  return (
      <HistoricDiplomaViewer diplomaGuid={diplomaGuid} />
  );
}
