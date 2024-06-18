import { BootcampResponse } from "../util/types";

type Props = {
    bootcamps: BootcampResponse[] | null;
}

export const TemplateCreatorPage = ({ bootcamps }: Props) => {
    return(
        <h1>TemplateCreatorPage</h1>
    )
}