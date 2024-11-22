import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/could-not-validate-diploma')({
  component: RouteComponent,
})

function RouteComponent() {
  return <p>Could not validate diploma</p>
}
