import { createFileRoute, Navigate } from '@tanstack/react-router'
import DiplomaGenerator from '@/components/diploma-generator/DiplomaGenerator'
import { PageLayout } from '@/components/layout'
import { SignedIn, SignedOut } from '@clerk/clerk-react';

export const Route = createFileRoute('/diploma-generator')({
  component: Page,
})

function Page() {
  return (
    <PageLayout>

      <SignedIn>
        <DiplomaGenerator />
      </SignedIn>

      <SignedOut>
        <Navigate to={"/"} />
      </SignedOut>
    </PageLayout>);
}


