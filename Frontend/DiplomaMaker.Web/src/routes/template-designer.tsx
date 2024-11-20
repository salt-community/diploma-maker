import { PageLayout } from "@/components/layout";
import { TemplateDesigner } from "@/components/template-designer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/template-designer")({
  component: Page,
});

function Page() {
  return (
    <PageLayout>
      <TemplateDesigner />
    </PageLayout>
  );
}
