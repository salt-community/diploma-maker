import { useQuery } from "@tanstack/react-query";
import { Endpoints } from "../../api";

export default function GetStudent() {
  const query = useQuery({
    queryKey: ["student"],
    queryFn: async () =>
      Endpoints.Students.getStudentByGuid(
        "e9af014a-b7c7-411d-a71a-dc221cf0d7bed"
      ),
  });

  if (query.error) {
    console.log(query.error);
  }

  return (
    <>
      {query.data?.guid}
      {/* <button onClick={async () => {
                const student = await Endpoints.Students.getStudentByGuid("e9af014a-b7c7-411d-a71a-dc221cf0d7bed");
                console.log(student);
            }
            }>GetStudent</button> */}
    </>
  );
}
