import UploadBootcamp from "./UploadBootcamp";
import TemplatePicker from "./TemplatePicker";
import BootcampForm from "./BootcampForm";

export default function DiplomaGenerator() {
    return (
        <div className="flex h-full flex-col">
            <div className="navbar z-40 bg-neutral">
                <div className="navbar-start">
                    <TemplatePicker />
                </div>

                <div className="navbar-end">
                    <UploadBootcamp />
                </div>
            </div>

            <BootcampForm />
        </div>
    );
}
