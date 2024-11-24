import { PageLayout } from "@/components/layout";
import { TemplateDesigner } from "@/components/template-designer";
import { SignedIn } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/template-designer")({
  component: Page,
});

function Page() {
  return (
    <PageLayout>

      <SignedIn>
        <TemplateDesigner />
      </SignedIn>

    </PageLayout>
  );
}
