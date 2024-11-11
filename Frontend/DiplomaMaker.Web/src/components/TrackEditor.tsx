import { SubmitHandler, useForm } from "react-hook-form";

type Track = {
    guid: string,
    name: string,
};

interface Props {
    track?: Track
};

type FormFields = Track;

export default function TrackEditor({ track }: Props) {
    const {
        register,
        handleSubmit,
    } = useForm<FormFields>()

    const onSubmit: SubmitHandler<FormFields> = (data) => console.log(data)

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    className='input input-bordered w-full max-w-xs'
                    {...register('name', { required: true, minLength: 3 })}
                    defaultValue={track?.name ?? 'New track name...'} />
                <button
                    type="submit">
                    Save Bootcamp
                </button>
            </form>
        </>
    );
}