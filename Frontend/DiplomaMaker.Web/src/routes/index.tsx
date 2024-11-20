import { Dashboard } from "@/components/dashboard";
import { PageLayout } from "@/components/layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  return (
    <PageLayout>
      <Dashboard />
    </PageLayout>
  );
}
