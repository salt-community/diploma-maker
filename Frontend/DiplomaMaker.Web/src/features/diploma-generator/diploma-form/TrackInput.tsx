import { DiplomaFormProps } from "./DiplomaFormProps";

export function TrackInput({ form }: DiplomaFormProps) {
    if (form == null) return;

    return (
        <label className="form-control w-full max-w-xs">
            <div className="label">
                <span className="label-text">Track</span>
            </div>

            <input {...form.register('track')}
                className="input input-bordered w-full max-w-xs"
                type="text"
            />
        </label>
    );
}