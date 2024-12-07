import {
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
  MailAtSign01Icon,
} from "hugeicons-react";
import { Subpage } from "./types";

type Props = {
  currentPage: Subpage;
  setCurrentPage: (page: Subpage) => void;
};

export default function BottomNav({ currentPage, setCurrentPage }: Props) {
  return (
    <div className="min-h-20 w-full bg-neutral pr-4">
      <div className="mx-auto flex h-full max-w-screen-lg items-center gap-4 px-6">
        {currentPage != "diploma-data" && (
          <button
            className="btn btn-secondary min-w-32"
            onClick={() => setCurrentPage("diploma-data")}
          >
            <ArrowLeftDoubleIcon size={24} />
            Back
          </button>
        )}
        {currentPage == "review-diplomas" ? (
          <button className="btn btn-primary ml-auto" onClick={() => {}}>
            Send Diplomas
            <MailAtSign01Icon size={24} />
          </button>
        ) : (
          <button
            className="btn btn-primary ml-auto min-w-32"
            onClick={() => setCurrentPage("review-diplomas")}
          >
            Continue
            <ArrowRightDoubleIcon size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
