import React, { useEffect, useState } from 'react';
import './HomePage.css'; // New CSS file
import { PdfCreatorIcon } from '../../components/MenuItems/Icons/PdfCreatorIcon';
import { TemplateCreatorIcon } from '../../components/MenuItems/Icons/TemplateCreatorIcon';
import { CogWheelIcon } from '../../components/MenuItems/Icons/CogWheelIcon';
import { HistoryIcon } from '../../components/MenuItems/Icons/HistoryIcon';
import { DescriptionCard } from '../../components/Feature/DescriptionCard/DescriptionCard';
import { DashBoardIcon } from '../../components/MenuItems/Icons/DashBoardIcon';

const shortDescriptionArray = [
  "Make your own template to use for your diplomas.",
  "User-friendly interface. Easy to customize for different needs.",
  "Plently of different fonts, colors and styles to choose from."
];


type hoverObjectType = 'templateCreator' | 'pdfMaking' | 'BootcampOptions' | 'History' |'Dashboard'

export function HomePage() {
  const [hoverObject, setHoverObject] = useState<hoverObjectType | null>();

  useEffect(() => {
    const styleOverride = document.createElement('style');
    styleOverride.innerHTML = hoverObject === 'templateCreator' ?
      `
        .navbar__item.template-creator{
          color: #fff;
        }
        .navbar__item.template-creator svg .stroke{
            stroke: #fff;
        }
        .navbar__item.template-creator .navbar__link .cls-1{
            stroke: #fff;
        }
    `
      : hoverObject === 'pdfMaking' ?
        `
        .navbar__item.pdf-creator{
          color: #fff;
        }
        .navbar__item.pdf-creator svg .stroke{
            stroke: #fff;
        }
        .navbar__item.pdf-creator svg .fill{
            fill: #fff;
        }
    `
        : hoverObject === 'BootcampOptions' ?
          `
        .navbar__item.bootcamp-management{
          color: #fff;
        }
        .navbar__item.bootcamp-management svg .stroke{
            stroke: #fff;
        }
        .navbar__item.bootcamp-management svg .fill{
            fill: #fff;
        }
    `
          : hoverObject === 'History' ?
            `
        .navbar__item.history{
          color: #fff;
        }
        .navbar__item.history svg .stroke{
            stroke: #fff;
        }
        .navbar__item.history svg .fill{
            fill: #fff;
        }
    `
          : hoverObject === 'Dashboard' ?
            `
      .navbar__item.overview{
        color: #fff;
      }
      .navbar__item.overview svg .stroke{
          stroke: #fff;
      }
      .navbar__item.overview svg .fill{
          fill: #fff;
      }
      `
                : ``;
    document.head.appendChild(styleOverride);

    return () => {
      document.head.removeChild(styleOverride);
    };

  }, [hoverObject]);


  return (
    <div className="homepage">
      <header className="homepage__header">
        <h1>Welcome Admin!</h1>
        <h4>It is <strong>Strongly recommended</strong> to read the instructions for each part of the application.</h4>
      </header>
      <div className="homepage__grid">
        <DescriptionCard 
          shortDescription={shortDescriptionArray}
          title="TemplateCreator"
          icon={TemplateCreatorIcon}
          className="gradient-templateCreator" 
          onMouseEnter={() => setHoverObject('templateCreator')}
          onMouseLeave={() => setHoverObject(null)}
        />
        <DescriptionCard
          shortDescription={shortDescriptionArray}
          title="PDFcreator"
          icon={PdfCreatorIcon}
          className="gradient-pdfMaking" 
          onMouseEnter={() => setHoverObject('pdfMaking')}
          onMouseLeave={() => setHoverObject(null)}
        />
        <DescriptionCard
          shortDescription={shortDescriptionArray}
          title="BootcampOptions"
          icon={CogWheelIcon}
          className="gradient-BootcampOptions" 
          onMouseEnter={() => setHoverObject('BootcampOptions')}
          onMouseLeave={() => setHoverObject(null)}
        />
        <DescriptionCard
          shortDescription={shortDescriptionArray}
          title="History"
          icon={HistoryIcon}
          className="gradient-History" 
          onMouseEnter={() => setHoverObject('History')}
          onMouseLeave={() => setHoverObject(null)}
        />
        <DescriptionCard
          shortDescription={shortDescriptionArray}
          title="Dashboard"
          icon={DashBoardIcon}
          className="gradient-Dashboard" 
          onMouseEnter={() => setHoverObject('Dashboard')}
          onMouseLeave={() => setHoverObject(null)}
        />
      </div>
    </div>
  );
}
