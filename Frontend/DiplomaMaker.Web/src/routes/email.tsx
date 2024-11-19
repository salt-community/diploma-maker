import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Authentication from '../components/development/Authentication';

export const Route = createFileRoute('/email')({
  component: Authentication,
})

