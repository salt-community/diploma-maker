import React, { useState } from 'react';
import './HomePage.css'; // New CSS file
import { PdfCreatorIcon } from '../../components/MenuItems/Icons/PdfCreatorIcon';
import { TemplateCreatorIcon } from '../../components/MenuItems/Icons/TemplateCreatorIcon';
import { CogWheelIcon } from '../../components/MenuItems/Icons/CogWheelIcon';
import { HistoryIcon } from '../../components/MenuItems/Icons/HistoryIcon';
import { DescriptionCard } from '../../components/Feature/DescriptionCard/DescriptionCard';

export function HomePage() {
  return (
    <div className="homepage">
      <header className="homepage__header">
        <h1>Welcome User!</h1>
        <h4>It is <strong>Strongly recommend</strong> to read the instructions for each part of the application.</h4>
      </header>
      <div className="homepage__grid">
        <DescriptionCard
          title="TemplateCreator"
          icon={TemplateCreatorIcon}                          
        />
        <DescriptionCard
           title="PDFMaking"
           icon={PdfCreatorIcon}      
        />
        <DescriptionCard
         title="BootcampOptions"
         icon={CogWheelIcon}   
        />
        <DescriptionCard
           title="History"
           icon={HistoryIcon} 
        />
      </div>
      <footer className="homepage__footer">
        <p>© 2024 DiplomaMakers</p>
      </footer>
    </div>
  );
}
