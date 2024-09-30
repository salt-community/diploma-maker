import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { DescriptionCard } from '../../components/Feature/DescriptionCard/DescriptionCard';
import { InstructionSlideshow } from '../../components/Content/InstructionSlideshow';
import { useNavigate } from 'react-router-dom';
import { highlightBootcampOptionsNav, highlightDashboardNav, highlightHistoryNav, highlightPDFcreatorNav, highlightTemplateCreatorNav, homePageLoggedInData, homePageLoggedOutData } from './HomepageData';
import { AddButtonSimple } from '../../components/MenuItems/Buttons/AddButtonSimple';
import { useAuth } from '@clerk/clerk-react';
import { EmailConfigInstructionSlides, ReadmeInstructionSlides } from '../../data/slidesData';

type Props = {
  userName: string | null;
  signedIn: boolean;
}

type hoverObjectType = 'TemplateCreator' | 'PDFcreator' | 'BootcampOptions' | 'History' | 'Dashboard'

export function HomePage({ userName, signedIn = false }: Props) {
  const [hoverObject, setHoverObject] = useState<hoverObjectType | null>();
  const [showInstructionSlideshow, setShowInstructionSlideshow] = useState<boolean>(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isCSSLoaded, setIsCSSLoaded] = useState(false);
  const nav = useNavigate();
  const { signOut } = useAuth();

  // To Make jsx wait for css to finish loading
  useEffect(() => {
    const handleLoad = () => {
      setIsCSSLoaded(true);
    };

    if (document.readyState === 'complete') {
      setIsCSSLoaded(true);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // To Ensure animation plays on first login
  useEffect(() => {
    const firstLoginStatus = localStorage.getItem('isFirstLogin');
    if (firstLoginStatus === 'false') {
      setIsFirstLogin(false);
    } else {
      setIsFirstLogin(true);
    }
  }, [signedIn]);

  homePageLoggedInData[0].onClick = () => setShowInstructionSlideshow(true);
  const HomePageContent = signedIn ? homePageLoggedInData : homePageLoggedOutData;

  useEffect(() => {
    const styleOverride = document.createElement('style');
    styleOverride.innerHTML = hoverObject === 'TemplateCreator' ? highlightTemplateCreatorNav
      : hoverObject === 'PDFcreator' ? highlightPDFcreatorNav
        : hoverObject === 'BootcampOptions' ? highlightBootcampOptionsNav
          : hoverObject === 'History' ? highlightHistoryNav
            : hoverObject === 'Dashboard' ? highlightDashboardNav
              : ``;
    document.head.appendChild(styleOverride);

    return () => {
      document.head.removeChild(styleOverride);
    };

  }, [hoverObject, signedIn]);

  return (
    <>
      {isCSSLoaded ? (
        <div className={`homepage ${!userName ? 'signin-view' : ''}`} >
          <header className={`homepage__header ${isFirstLogin ? 'animate' : ''}`}>
            <h1>Welcome <span>{userName ?? "Guest"}!</span></h1>
          </header>
          <div className={`homepage__grid ${signedIn && 'loggedin'}`}>
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
                classOverride={`${isFirstLogin && 'animate'}`}
              />
            ))}
          </div>
          {!signedIn &&
            <div className='homepage_sign-in-section'>
              <p className="homepage_login-text">Looking to do more with diplomas?</p>
              <div className="homepage_login-button_container">
                <AddButtonSimple onClick={() => { nav('/sign-in') }} text={"Login"} classNameOverride='add-button-HomePage' />
              </div>
            </div>}
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <InstructionSlideshow show={showInstructionSlideshow} slides={ReadmeInstructionSlides} onClose={() => setShowInstructionSlideshow(false)} />
    </>
  );
}