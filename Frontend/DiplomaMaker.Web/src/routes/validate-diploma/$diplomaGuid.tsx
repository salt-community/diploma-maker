import { BackendService } from '@/services';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react';
//import ValidateDiploma from '../components/ValidateDiploma'

export const Route = createFileRoute('/validate-diploma/$diplomaGuid')({
  component: Page,
})

function Page() {
  const { diplomaGuid } = Route.useParams();
  const navigate = useNavigate()

  useEffect(() => {
    const getDiploma = async () => {
      console.log("getting diploma...");
      try {
        const diplomaWithContent = await BackendService.getDiplomaWithContentByGuid(diplomaGuid);
        console.log(diplomaWithContent)
      } catch (error) {
        console.log((error as Error).message);
        console.log("Could not find diploma");
        navigate({ to: '/could-not-validate-diploma' });
      }
    };

    getDiploma();
  }, [])

  return (
    <>
      <div>Validate Diploma</div>
      <p>{diplomaGuid}</p>
    </>
  );
}
