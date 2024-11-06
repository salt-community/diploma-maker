import { createFileRoute } from '@tanstack/react-router'
import { EndpointTests } from '../components/pages/EndpointTests'

export const Route = createFileRoute('/endpointtests')({
  component: EndpointTests,
})
