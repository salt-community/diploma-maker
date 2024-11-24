import { PageLayout } from "@/components/layout";
import { TemplateDesigner } from "@/components/template-designer";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/template-designer")({
  component: Page,
});

function Page() {
  return (
    <PageLayout>

      <SignedIn>
        <TemplateDesigner />
      </SignedIn>

      <SignedOut>
        <Navigate to={"/"} />
      </SignedOut>

    </PageLayout>
  );
}
