import {
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
  MailAtSign01Icon,
} from "hugeicons-react";
import { Subpage } from "./types";
import { BOOTCAMP_DATA_FORM_ID } from "./constants";

type Props = {
  currentPage: Subpage;
  setCurrentPage: (page: Subpage) => void;
  onSendDiplomas: () => void;
};

export default function BottomNav({
  currentPage,
  setCurrentPage,
  onSendDiplomas,
}: Props) {
  return (
    <div className="min-h-20 w-full bg-neutral pr-4">
      <div className="mx-auto flex h-full max-w-screen-lg items-center gap-4 px-6">
        {currentPage != "bootcamp-data" && (
          <button
            className="btn btn-secondary min-w-32"
            onClick={() => setCurrentPage("bootcamp-data")}
          >
            <ArrowLeftDoubleIcon size={24} />
            Back
          </button>
        )}

        {currentPage == "review-diplomas" ? (
          <button className="btn btn-primary ml-auto" onClick={onSendDiplomas}>
            Send Diplomas
            <MailAtSign01Icon size={24} />
          </button>
        ) : (
          <button
            type="submit"
            form={BOOTCAMP_DATA_FORM_ID}
            className="btn btn-primary ml-auto min-w-32"
          >
            Continue
            <ArrowRightDoubleIcon size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
