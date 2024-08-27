import { EditorRightSideBarSection } from "./EditorRightSideBarSection";

type Page = {
    pageTitle: string;
    handler: () => void;
    sections: { sectionTitle: string; component: React.ReactNode }[];
}
  
interface Props {
    pages: Page[];
    activePage: number;
    setActivePage: (pageIndex: number) => void;
}

export const EditorRightSidebar = ({ pages, activePage, setActivePage }: Props) => {
  return (
    <section className="templatecreator-page__rightsidebar">
      <div className="templatecreator-page__rightsidebar-menu">
        <header className="templatecreator-page__rightsidebar-menu-header">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => {
                setActivePage(index);
                page.handler();
              }}
              className={activePage === index ? 'active' : ''}
            >
              {page.pageTitle}
            </button>
          ))}
        </header>
        {pages[activePage]?.sections.map((section, index) => (
          <EditorRightSideBarSection key={index} title={section.sectionTitle} component={section.component} />
        ))}
      </div>
    </section>
  );
};