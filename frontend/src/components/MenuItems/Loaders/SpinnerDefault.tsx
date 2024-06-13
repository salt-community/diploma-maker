import './SpinnerDefault.css'

type Props = {
    classOverride: string
}
export const SpinnerDefault = ({classOverride}: Props) => {
    return(
        <span className={"spinner-default " + classOverride}></span>
    )
}