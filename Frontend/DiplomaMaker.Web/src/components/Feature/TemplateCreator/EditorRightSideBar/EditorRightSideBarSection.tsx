type Props = {
  title: string;
  component: React.ReactNode;
}

export const EditorRightSideBarSection = ({ title, component }: Props) => {
  return (
    <section className="templatecreator-page__rightsidebar-menu-section">
      {title && <h3>{title}</h3>}
      {component}
    </section>
  );
};