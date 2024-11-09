import { Student } from "../../api";
import EntityTable from "../EntityTable";

export function EndpointTests() {
  return (
    <>
      <EntityTable<Student> controller={'Student'} />
    </>
  );
}
