import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { DescriptionCard } from '../../components/Feature/DescriptionCard/DescriptionCard';
import { InstructionSlideshow } from '../../components/Content/InstructionSlideshow';
import { EmailConfigInstructionSlides } from '../../data/data';
import { useNavigate } from 'react-router-dom';
import { highlightBootcampOptionsNav, highlightDashboardNav, highlightHistoryNav, highlightPDFcreatorNav, highlightTemplateCreatorNav, homePageLoggedInData, homePageLoggedOutData, singleGridCardCSSOverride } from './HomepageData';
import { AddButtonSimple } from '../../components/MenuItems/Buttons/AddButtonSimple';

type Props = {
  userName: string | null;
  signedIn: boolean;
}

type hoverObjectType = 'TemplateCreator' | 'PDFcreator' | 'BootcampOptions' | 'History' | 'Dashboard'

export function HomePage({ userName, signedIn = false }: Props) {
  const [hoverObject, setHoverObject] = useState<hoverObjectType | null>();
  const [showInstructionSlideshow, setShowInstructionSlideshow] = useState<boolean>(false);
  const nav = useNavigate();

  homePageLoggedInData[homePageLoggedInData.length - 1].onClick = () => setShowInstructionSlideshow(true);
  const HomePageContent = signedIn ? homePageLoggedInData : homePageLoggedOutData;

  useEffect(() => {
    const styleOverride = document.createElement('style');
    const gridOverride = document.createElement('style');
    gridOverride.innerHTML = !signedIn && singleGridCardCSSOverride;
    styleOverride.innerHTML = hoverObject === 'TemplateCreator' ? highlightTemplateCreatorNav
        : hoverObject === 'PDFcreator' ? highlightPDFcreatorNav
        : hoverObject === 'BootcampOptions' ? highlightBootcampOptionsNav
        : hoverObject === 'History' ? highlightHistoryNav
        : hoverObject === 'Dashboard' ? highlightDashboardNav
      : ``;
    document.head.appendChild(styleOverride);
    document.head.appendChild(gridOverride);

    return () => {
      document.head.removeChild(styleOverride);
      document.head.removeChild(gridOverride);
    };

  }, [hoverObject, signedIn]);


  return (
    <>
      <div className="homepage">
        <header className="homepage__header">
          <h1>Welcome <span>{userName ?? "Guest"}!</span></h1>
          {/* <h4>It is <strong>Strongly recommended</strong> to read the instructions for each part of the application.</h4> */}
        </header>
        <div className="homepage__grid">
          {HomePageContent.map(content => (
            <DescriptionCard
              key={`card__${content.title}`}
              description={content.description}
              title={content.title}
              link={content.link}
              icon={content.icon}
              onMouseEnter={() => setHoverObject(content.title as hoverObjectType)}
              onMouseLeave={() => setHoverObject(null)}
              onClick={content.onClick ? content.onClick : undefined}
            />
          ))}

        </div>
        {!signedIn &&
          <div className='homepage_sign-in-section'>
            <p className="homepage_login-text">Not just <strong>ANY</strong> user? </p>
            <div className="homepage_login-button_container">
              <AddButtonSimple onClick={() => { nav('/sign-in') }} text={"Login"} classNameOverride='add-button-HomePage' />
            </div>
          </div>}
      </div>
      <InstructionSlideshow show={showInstructionSlideshow} slides={EmailConfigInstructionSlides} onClose={() => setShowInstructionSlideshow(false)} />
    </>
  );
}
