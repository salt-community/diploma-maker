import { useCache } from '@/hooks';
import { BackendService, DiplomaService } from '@/services';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react';
import type { BackendTypes, PdfMeTypes } from '@/services';
import DiplomaViewer from '@/components/diploma-viewer/DiplomaViewer';

export const Route = createFileRoute('/validate-diploma/$diplomaGuid')({
  component: Page,
})

function Page() {
  const { diplomaGuid } = Route.useParams();
  const [diploma, setDiploma] = useCache<BackendTypes.DiplomaWithContent>(["DiplomaWithContent"]);
  const navigate = useNavigate()

  useEffect(() => {
    const getDiploma = async () => {
      try {
        setDiploma(await BackendService.getDiplomaWithContentByGuid(diplomaGuid));
      } catch (error) {
        console.log((error as Error).message);
        console.log("Could not find diploma");
        navigate({ to: '/could-not-validate-diploma' });
      }
    };

    getDiploma();
  }, []);



  return (
    <>
      {diploma != null &&
        <DiplomaViewer template={
          JSON.parse(diploma.templateJson) as PdfMeTypes.Template}
          substitions={DiplomaService.createSubstitions({
            graduationDate: diploma.graduationDate,
            students: [],
            track: diploma.track
          }, {
            email: diploma.studentEmail,
            name: diploma.studentName
          })} />}
      <div>Validate Diploma</div>
      <p>{diplomaGuid}</p>
    </>
  );
}
