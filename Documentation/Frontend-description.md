(read in code mode)

The data coming into the frontend mirrors the data format in Backend-description. But with typescript types
src/util/types.ts


**Pages Overview**
    </HomePage> [/] - Root redirects to Homepage 
    </sign-in> [/sign-in] - Sign in is clerks component for logging in and getting the jwt token
    </HomePage> [/home] - Homepage renders anonymous or loggedin view. anonymous only have access to verify
    </BootcampManagement> [/bootcamp-management] - CRUD bootcamps
    </DiplomaMaking> [/pdf-creator] - Add students to bootcamp, Update backend with those students and generate the pdfs
    </OverviewPage> [/overview] - Lists all previously generated bootcamps, able to edit email field of students
        </EmailClient> - Sends emails to selected students using the google gmail api
    </TemplateCreatorPage> [/template-creator] - Editing Templates
    </VerificationInputPage> [/verify] - Put in and submit verification code
    </VerificationPage> [/verify/:verificationCode] - Validates the authenticity of the verificationcode url
    </HistoryPage> [/history] - Shows versions/previous student generations.
    </ErrorPage> [*] - Shows some breathtaking work done by Zero

**Pages Basics**
    