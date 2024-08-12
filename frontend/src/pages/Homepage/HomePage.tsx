import React, { useState } from 'react';
import './HomePage.css'; // New CSS file
import { PdfCreatorIcon } from '../../components/MenuItems/Icons/PdfCreatorIcon';
import { TemplateCreatorIcon } from '../../components/MenuItems/Icons/TemplateCreatorIcon';
import { CogWheelIcon } from '../../components/MenuItems/Icons/CogWheelIcon';
import { HistoryIcon } from '../../components/MenuItems/Icons/HistoryIcon';
import { DescriptionCard } from '../../components/Feature/DescriptionCard/DescriptionCard';

const shortDescriptionArray = [
  "This can be used for creating templates.",
  "Easy to customize for different needs.",
  "Supports various file formats.",
  "User-friendly interface."
];

export function HomePage() {
  return (
    <div className="homepage">
      <header className="homepage__header">
        <h1>Welcome User!</h1>
        <h4>It is <strong>Strongly recommended</strong> to read the instructions for each part of the application.</h4>
      </header>
      <div className="homepage__grid">
        <DescriptionCard
          shortDescription= {shortDescriptionArray}
          LongDescription=''
          title="TemplateCreator"
          icon={TemplateCreatorIcon}
        />
        <DescriptionCard
          shortDescription= {shortDescriptionArray}
          LongDescription=''
          title="PDFMaking"
          icon={PdfCreatorIcon}
        />
        <DescriptionCard
          shortDescription= {shortDescriptionArray}
          LongDescription=''
          title="BootcampOptions"
          icon={CogWheelIcon}
        />
        <DescriptionCard
          shortDescription= {shortDescriptionArray}
          LongDescription=''
          title="History"
          icon={HistoryIcon}
        />
      </div>
    </div>
  );
}
