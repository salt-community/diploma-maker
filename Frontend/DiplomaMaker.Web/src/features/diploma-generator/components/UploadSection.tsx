import { BootcampData } from "../types";

type Props = {
  onUpdateBootcampData: (data: BootcampData) => void;
};

export default function UploadSection({ onUpdateBootcampData }: Props) {
  // TODO: Show error messages in UI
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      console.log("Could not upload file.");
      return;
    }

    try {
      const text = await file.text();
      const bootcampData: BootcampData = JSON.parse(text);
      onUpdateBootcampData(bootcampData);
    } catch (error) {
      console.log("Error parsing JSON file: ", error);
      return;
    }
  };

  return (
    <div className="text-center">
      <h2 className="mb-6 text-lg font-medium">
        Upload a bootcamp.json file to auto-fill the form
        <span className="mt-3 block text-base font-normal opacity-80">
          (optional)
        </span>
      </h2>

      <label className="form-control mx-auto w-full max-w-xs">
        <input
          className="file-input file-input-bordered file-input-primary w-full max-w-xs"
          type="file"
          accept="application/json"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
