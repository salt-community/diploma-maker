import { createFileRoute } from '@tanstack/react-router'
import DiplomaGenerator from '@/components/diploma-generator/DiplomaGenerator'
import { PageLayout } from '@/components/layout'
import { SignedIn } from '@clerk/clerk-react';

export const Route = createFileRoute('/diploma-generator')({
  component: Page,
})

function Page() {
  return (
    <PageLayout>

      <SignedIn>
        <DiplomaGenerator />
      </SignedIn>
      
    </PageLayout>);
}


