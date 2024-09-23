import { CogWheelIcon } from "../../components/MenuItems/Icons/CogWheelIcon";
import { DashBoardIcon } from "../../components/MenuItems/Icons/DashBoardIcon";
import { HistoryIcon } from "../../components/MenuItems/Icons/HistoryIcon";
import { PdfCreatorIcon } from "../../components/MenuItems/Icons/PdfCreatorIcon";
import { ReadmeIcon } from "../../components/MenuItems/Icons/ReadmeIcon";
import { TemplateCreatorIcon } from "../../components/MenuItems/Icons/TemplateCreatorIcon";
import { VerifyIcon } from "../../components/MenuItems/Icons/VerifyIcon";

export const homePageLoggedOutData = [
    {
      title: 'Verify Your Diploma',
      description: 'Verify the Authenticity of your diploma!',
      icon: VerifyIcon,
      link: '/verify',
    },
]

export const homePageLoggedInData = [
    {
        title: 'Readme',
        description: 'If you need guidance.',
        icon: ReadmeIcon,
        onClick: null,
    },
    {
        title: 'Make Template',
        description: 'Make your own template to use for your diploma generation.',
        icon: TemplateCreatorIcon,
        link: '/template-creator',
        onClick: null,
    },
    {
        title: 'Create Diplomas',
        description: 'Generate your diplomas. This is where all the magic happens.',
        icon: PdfCreatorIcon,
        link: '/pdf-creator',
        onClick: null,
    },
    {
        title: 'Generated Diplomas',
        description: 'Send Emails to students & Overview of all generated diplomas.',
        icon: DashBoardIcon,
        link: '/overview',
        onClick: null,
    },
    {
        title: 'Bootcamp Management',
        description: 'Add your bootcamp to generate diplomas from.',
        icon: CogWheelIcon,
        link: '/bootcamp-management',
        onClick: null,
    },
    {
        title: 'History',
        description: 'History of past diploma generations & applied templates.',
        icon: HistoryIcon,
        link: '/history',
        onClick: null,
    },
  ]


export const highlightTemplateCreatorNav = 
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

export const highlightPDFcreatorNav = 
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

export const highlightBootcampOptionsNav = 
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

export const highlightHistoryNav = 
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

export const highlightDashboardNav = 
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