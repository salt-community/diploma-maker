import { PageLayout } from '@/components/layout';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/could-not-validate-diploma')({
  component: RouteComponent,
})

function RouteComponent() {
  return (<PageLayout>
    <p>Could not validate diploma</p>
  </PageLayout>);
}
