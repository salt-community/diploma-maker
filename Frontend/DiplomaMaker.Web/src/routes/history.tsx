import { createFileRoute } from '@tanstack/react-router'
import { BackendService, DiplomaService, PdfMeTypes, type BackendTypes } from '@/services';
import { useCache, useEntity } from '@/hooks';
import { useEffect } from 'react';
import DiplomaViewer from '@/components/diploma-viewer/DiplomaViewer';

export const Route = createFileRoute('/history')({
  component: Page,
})

function Page() {
  const { entities: diplomas, getAllEntities: getAllDiplomas } = useEntity<BackendTypes.Diploma>("Diploma");
  const [diplomasWithContent, setDiplomasWithContent] = useCache<BackendTypes.DiplomaWithContent[]>(["DiplomaWithContent"]);

  useEffect(() => {
    getAllDiplomas();
  }, []);

  useEffect(() => {
    const getDiplomasWithContent = async () => {
      if (diplomasWithContent == null)
        setDiplomasWithContent([]);

      try {
        const fullDiplomaPromises = diplomas.map(async (diploma) => {
          const diplomaWithContent = await BackendService.getDiplomaWithContentByGuid(diploma.guid!);
          console.log(diplomaWithContent);
          if (diplomasWithContent == null) {
            setDiplomasWithContent([diplomaWithContent]);
          } else {
            setDiplomasWithContent([...diplomasWithContent, diplomaWithContent]);
          }
        });

        await Promise.all(fullDiplomaPromises);
      } catch (error) {
        console.log((error as Error).message)
      }
    };

    getDiplomasWithContent();
  }, [diplomas]);

  return (<>
    {diplomasWithContent && diplomasWithContent.map(diplomaWithContent => {
      return <DiplomaViewer template={
        JSON.parse(diplomaWithContent.templateJson) as PdfMeTypes.Template}
        substitions={DiplomaService.createSubstitions({
          graduationDate: diplomaWithContent.graduationDate,
          students: [],
          track: diplomaWithContent.track
        }, {
          email: diplomaWithContent.studentEmail,
          name: diplomaWithContent.studentName
        })} />
    })}
  </>)
}
