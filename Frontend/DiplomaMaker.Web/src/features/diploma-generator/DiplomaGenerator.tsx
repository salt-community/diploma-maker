import { useState } from "react";
import { DiplomaForm } from "./diploma-form-subpage";
import SelectTemplateSubpage from "./SelectTemplateSubpage";

export default function DiplomaGenerator() {
    const [pageNumber, setPageNumber] = useState<number>(0);

    function DiplomaGeneratorNavbar() {
        const navButtons = ["Diploma Data", "Select Template"].map((title, index) =>
            <button
                key={index}
                className={`join-item btn ${pageNumber == index && "btn-active"}`}
                onClick={() => setPageNumber(index)}
            >
                {title}
            </button>);

        return (
            <div className="navbar z-40 bg-neutral">
                <div className="navbar-start"></div>

                <div className="navbar-center">
                    <div className="join">
                        {navButtons}
                    </div>
                </div>

                <div className="navbar-end"></div>
            </div>
        )
    }

    return (
        <div className="flex h-full w-full px-56 flex-col">
            <DiplomaGeneratorNavbar />
            <DiplomaForm display={pageNumber == 0} />
            <SelectTemplateSubpage display={pageNumber == 1} />
        </div >
    );
}


