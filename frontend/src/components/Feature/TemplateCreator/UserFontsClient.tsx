import './UserFontsClient.css'

export type UserFontsClientType = 'addNewFont' | 'manageFonts'

type Props = {
    type: UserFontsClientType;
}

export const UserFontsClient = ( { type }: Props) => {
  return (
    <section className="userfont-container">

    </section>
  );
};