import { Dashboard } from "@/features/dashboard";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  return (
    <>

      <SignedIn>
        <Dashboard />
      </SignedIn>

      <SignedOut>
        <SignIn />
      </SignedOut>

    </>
  );
}
