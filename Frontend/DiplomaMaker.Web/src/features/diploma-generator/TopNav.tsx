import { BOOTCAMP_DATA_FORM_ID } from "./constants";
import { Subpage } from "./types";

type Props = {
  currentPage: Subpage;
  setCurrentPage: (page: Subpage) => void;
};

export function TopNav({ currentPage, setCurrentPage }: Props) {
  return (
    <div className="w-full bg-neutral py-2 pr-4 shadow-sm">
      <div className="mx-auto max-w-screen-lg">
        <ul className="steps w-full p-0 font-display">
          <li
            className={`step step-primary mt-0 ${currentPage == "bootcamp-data" && "font-medium"}`}
          >
            <button onClick={() => setCurrentPage("bootcamp-data")}>
              Bootcamp Data
            </button>
          </li>
          <li
            className={`step mt-0 ${currentPage == "review-diplomas" && "step-primary font-medium"}`}
          >
            <button type="submit" form={BOOTCAMP_DATA_FORM_ID}>
              Review Diplomas
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
