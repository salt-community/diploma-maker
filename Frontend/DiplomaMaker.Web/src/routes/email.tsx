import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Authentication from '../components/development/Authentication';
import DragAndDropFileParser from '../components/development/DragAndDropFileParser';

export const Route = createFileRoute('/email')({
  component: ComponentName
})

export default function ComponentName() {
  return (
    <>
      <Authentication />
      <DragAndDropFileParser />
    </>
  );
}

