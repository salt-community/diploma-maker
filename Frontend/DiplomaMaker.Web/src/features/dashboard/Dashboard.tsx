import { useUser } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import { FileEditIcon, Files01Icon, PlusSignIcon } from "hugeicons-react";

import { PageContainer } from "@/components/layout";

// TODO: Update with actual Diploma Count
export default function Dashboard() {
  const { user } = useUser();

  return (
    <PageContainer>
      <h1 className="mb-0 text-[32px] font-bold">Welcome {user?.fullName}!</h1>
      <p className="mt-6 text-lg font-semibold">What would you like to do?</p>
      <div className="mt-16 grid grid-cols-3 gap-8">
        <GenerateDiplomaLink />
        <ManageTemplatesLink />
        <ViewDiplomasLink />
      </div>
      <div className="mt-20 flex items-center gap-12 rounded-2xl border-2 border-base-200 p-12">
        <Files01Icon size={100} className="text-base-200" />
        <div className="">
          <p className="m-0 font-display text-4xl font-semibold text-primary">
            3200+
          </p>
          <p className="m-0 mt-4 text-xl font-semibold">Diplomas Generated</p>
        </div>
      </div>
    </PageContainer>
  );
}

function GenerateDiplomaLink() {
  return (
    <Link
      to="/diploma-generator"
      className="bg-primary-alt group grid h-64 place-items-center rounded-2xl border border-[#FFA5A5] no-underline transition-colors hocus:bg-[#FFE8E8]"
    >
      <div className="flex flex-col items-center gap-6">
        <PlusSignIcon size={38} className="text-primary" />
        <span className="font-display text-lg font-semibold text-secondary-dark">
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
      className="group grid h-64 place-items-center rounded-2xl border border-[#ABB2FF] bg-accent no-underline transition-colors hocus:bg-[#EAEBFF]"
    >
      <div className="flex flex-col items-center gap-6">
        <FileEditIcon size={38} className="text-primary" />
        <span className="font-display text-lg font-semibold">
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
      className="group grid h-64 place-items-center rounded-2xl border border-[#97D2FF] bg-info no-underline transition-colors hocus:bg-[#F2FAFF]"
    >
      <div className="flex flex-col items-center gap-6">
        <Files01Icon size={38} className="text-primary" />
        <span className="font-display text-lg font-semibold">
          View Diplomas
        </span>
      </div>
    </Link>
  );
}
