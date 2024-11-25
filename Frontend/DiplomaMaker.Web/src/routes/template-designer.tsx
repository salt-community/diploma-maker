import { TemplateDesigner } from "@/features/template-designer";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/template-designer")({
  component: Page,
});

function Page() {
  return (
    <>
      <SignedIn>
        <TemplateDesigner />
      </SignedIn>

      <SignedOut>
        <Navigate to={"/"} />
      </SignedOut>
    </>
  );
}
