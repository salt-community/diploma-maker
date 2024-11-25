import { createFileRoute, Navigate } from '@tanstack/react-router'
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { DiplomaGenerator } from '@/features/diploma-generator';

export const Route = createFileRoute('/diploma-generator')({
  component: Page,
})

function Page() {
  return (
    <>
      <SignedIn>
        <DiplomaGenerator />
      </SignedIn>

      <SignedOut>
        <Navigate to={"/"} />
      </SignedOut>
    </>);
}


