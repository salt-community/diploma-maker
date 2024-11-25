import { Dashboard } from "@/components/dashboard";
import { PageLayout } from "@/components/layout";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  return (
    <PageLayout>

      <SignedIn>
        <Dashboard />
      </SignedIn>

      <SignedOut>
        <SignIn />
      </SignedOut>

    </PageLayout>
  );
}
