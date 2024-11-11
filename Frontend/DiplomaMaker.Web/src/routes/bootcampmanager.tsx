import { createFileRoute } from '@tanstack/react-router'

import BootcampManager from '../components/BootcampManager'

export const Route = createFileRoute('/bootcampmanager')({
  component: () => {
    return <BootcampManager />
  },
})
