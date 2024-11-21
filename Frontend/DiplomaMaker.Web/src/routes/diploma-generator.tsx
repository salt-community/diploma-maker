import { createFileRoute } from '@tanstack/react-router'
import DiplomaGenerator from '@/components/diploma-generator/DiplomaGenerator'

export const Route = createFileRoute('/diploma-generator')({
  component: Page,
})

function Page() {
  return <DiplomaGenerator />
}


