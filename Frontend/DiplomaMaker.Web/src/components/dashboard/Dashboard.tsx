import { PageContainer } from "@/components/layout";
import { Link } from "@tanstack/react-router";
import { FileEditIcon, Files01Icon, PlusSignIcon } from "hugeicons-react";

function Dashboard() {
  return (
    <PageContainer>
      <h1>Welcome John Doe!</h1>
      <p className="text-lg font-bold">What would you like to do?</p>
      <div className="mt-16 grid grid-cols-2 gap-8">
        <GenerateDiplomaLink />
        <ManageTemplatesLink />
        <ViewDiplomasLink />
      </div>
    </PageContainer>
  );
}

  function GenerateDiplomaLink() {
  return (
    <Link
      to="/diploma-generator"
      className="group col-span-full grid h-64 place-items-center rounded-2xl bg-accent-light no-underline"
    >
      <div className="flex flex-col items-center gap-4 transition-transform group-hover:scale-105">
        <PlusSignIcon size={46} className="text-primary" />
        <span className="font-display text-xl font-semibold text-secondary-dark">
          Generate Diplomas
        </span>
      </div>
    </Link>
  );
}

function ManageTemplatesLink() {
  return (
    <Link
      to="/template-designer"
      className="group grid h-64 place-items-center rounded-2xl bg-secondary no-underline"
    >
      <div className="flex flex-col items-center gap-4 transition-transform group-hover:scale-105">
        <FileEditIcon size={38} className="text-primary" />
        <span className="font-display text-lg font-semibold text-secondary-content">
          Manage Templates
        </span>
      </div>
    </Link>
  );
}

function ViewDiplomasLink() {
  return (
    <Link
      to="/history"
      className="group grid h-64 place-items-center rounded-2xl bg-info no-underline"
    >
      <div className="flex flex-col items-center gap-4 transition-transform group-hover:scale-105">
        <Files01Icon size={38} className="text-primary" />
        <span className="font-display text-lg font-semibold">
          View Diplomas
        </span>
      </div>
    </Link>
  );
}

export default Dashboard;
