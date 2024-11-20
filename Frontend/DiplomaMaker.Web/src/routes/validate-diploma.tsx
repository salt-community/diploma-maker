import { createFileRoute } from "@tanstack/react-router";
//import ValidateDiploma from '../components/ValidateDiploma'

export const Route = createFileRoute("/validate-diploma")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Validate Diploma</div>;
  //return <ValidateDiploma />
}
