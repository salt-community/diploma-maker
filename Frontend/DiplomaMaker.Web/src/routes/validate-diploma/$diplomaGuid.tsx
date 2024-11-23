import { useCache } from '@/hooks';
import { BackendService, DiplomaService } from '@/services';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react';
import type { BackendTypes, PdfMeTypes } from '@/services';
import PreviewDiplomaViewer from '@/components/diploma-viewer/PreviewDiplomaViewer';

export const Route = createFileRoute('/validate-diploma/$diplomaGuid')({
  component: Page,
})

function Page() {
  const { diplomaGuid } = Route.useParams();
  const [diploma, setDiploma] = useCache<BackendTypes.HistoricDiploma>(["DiplomaWithContent"]);
  const navigate = useNavigate()

  useEffect(() => {
    const getDiploma = async () => {
      try {
        setDiploma(await BackendService.getHistoricDiplomaByGuid(diplomaGuid));
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
        <PreviewDiplomaViewer template={
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
