import { DiplomaFormProps } from "./DiplomaFormProps";

export function TrackInput({ form }: DiplomaFormProps) {
  if (form == null) return;

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text">Track</span>
      </div>

      <input
        {...form.register("track")}
        className="input input-bordered w-full"
        type="text"
        placeholder="E.g. JSFS"
      />
    </label>
  );
}
