import { createFileRoute, Navigate } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import DiplomaHistory from '@/components/DiplomaHistory';

export const Route = createFileRoute('/history')({
  component: Page,
})

function Page() {
  return (
    <PageLayout>
      <SignedIn>
        <DiplomaHistory />
      </SignedIn>

      <SignedOut>
        <Navigate to={"/"} />
      </SignedOut>
    </PageLayout>
  );
}
