import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useCache, useHistoricDiploma, useModal } from '@/hooks';
import { StringService } from '@/services';
import HistoricDiplomaViewer from '@/components/diploma-viewer/HistoricDiplomaViewer';
import { Modal, PageLayout } from '@/components/layout';
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
