import { createFileRoute } from '@tanstack/react-router'
//import ValidateDiploma from '../components/ValidateDiploma'

export const Route = createFileRoute('/validate-diploma/$diplomaGuid')({
  component: Page,
})

function Page() {
  const { diplomaGuid } = Route.useParams()
  return (
    <>
      <div>Validate Diploma</div>
      <p>{diplomaGuid}</p>
    </>
  )
  //return <ValidateDiploma />
}
