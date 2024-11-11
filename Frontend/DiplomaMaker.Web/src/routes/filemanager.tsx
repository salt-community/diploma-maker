import { createFileRoute } from '@tanstack/react-router'

import FileManager from '../components/FileManager'

export const Route = createFileRoute('/filemanager')({
  component: () => {
    return <FileManager />
  },
})
