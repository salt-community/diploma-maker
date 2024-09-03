import React from 'react';
import './EditorLeftSideBar.css'

type Menuitems = {
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
    className: string;
};

type Props = {
    optionsItems: Menuitems[];
};

export const EditorLeftSideBar = ({ optionsItems }: Props) => {
    return (
        <section className="templatecreator-page__leftsidebar">
            <div className="templatecreator-page__leftsidebar-menu">
                <section className="templatecreator-page__leftsidebar-menu-section">
                    {optionsItems.map(item => (
                        <button onClick={item.onClick} className={item.className}>
                            {item.icon}
                            <p>{item.text}</p>
                        </button>
                    ))}
                </section>
            </div>
        </section>
    );
};