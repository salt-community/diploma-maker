// @ts-ignore
export const saltDefaultData: SaltData = {
    classname: ".Net Fullstack",
    dategraduate: '12/04/2024',
    students: [{
      name: "John Smith",
    } ]
  };

export const EmailConfigInstructionSlides = 
    [
      {
          image: '/instructionslides/emailconfig_slide_1.webp',
          title: 'Step 1 - Setup Google App Password ',
          description: 'Login to your google account following this [link](https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4OMlzz3HfDjNm4lZWbhLOqQ8_poQJ[…]fREkhU7ftg5bK8ST_ycSMdq1U0j-5tDI-EBAnG-MCeTtnkOOUQitYsFD_Q)',
          alt: 'Login to google account',
      },
      {
          image: '/instructionslides/emailconfig_slide_2.webp',
          title: 'Step 2 - Create an email sender',
          description: 'Name it sender or similar',
          alt: 'Create App Password',
      },
      {
        image: '/instructionslides/emailconfig_slide_3.webp',
        title: 'Step 3 - Copy the app password to clipboard',
        description: 'This is the code used to verify the sender',
        alt: 'Generated app password',
      },
      {
        image: '/instructionslides/emailconfig_slide_4.webp',
        title: 'Step 4 - Paste your email + app password into the Sender Code field',
        description: "That's it!",
        alt: 'Email Sender view',
      },
  ]