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
**DiplomaMaking Page**
    ***Components***
        - `DiplomaDataForm` - Provides input fields and selection options for:
            - Choosing a track and bootcamp via dropdown menus.
            - Applying a diploma template.
            - Adding or updating student information manually or through file upload.
            - Setting PDF generation options to generate for a specific student or an entire bootcamp.
        - `PreviewDiploma` - Offers a real-time diploma preview for the selected student or bootcamp, with navigation to switch between students, using an embedded PDF viewer for an accurate representation of the diploma.
    ***Functions and Flow***
        - `Track and Bootcamp Selection` - Allows users to select a track and bootcamp, dynamically loading associated students and templates for quick updates and preview adjustments.
        - `Template and Student Data Management` - Enables the selection and updating of diploma templates. Student data can be manually entered or uploaded, providing flexibility in data management.
        - `PDF Generation Options` - Users can select individual students or whole bootcamps for PDF generation, with options to view, print, or download the PDFs once created.
    ***Core Methods and Handlers***
        - `postSelectedBootcampData` - Saves the selected bootcamp’s updated data, including student and template details, to the backend.
        - `generatePDFHandler` - Manages PDF creation based on user preferences, supporting options to print, view, or download PDFs, tailored for individual students or the entire bootcamp.
        - `AddNewBootcampForm` - Supports the addition of new bootcamps, updating the available selection in real-time.
        - `PaginationMenu` - Provides pagination controls within the PreviewDiploma component to navigate through students in a bootcamp.
    ***User Interactions***
        - `Adding Students and Bootcamps` - Users can add or update students and bootcamps with instant feedback, reflecting changes in the preview section.
        - `Generating Diplomas` - After configuring the options, users can generate PDF diplomas and choose to view, print, or download the results directly.
    ***Error Handling and Alerts***
        - `Custom Alerts` - Displays messages to notify users of actions, errors, or successes, such as when adding diplomas or handling errors during PDF generation.
        - `Loading Spinner and Error Icon` - Shown during data fetching or in cases of loading issues, providing clear feedback to users.

**OverviewPage**  
    ***Components***
        - `DiplomaCardContainer` - Displays student cards with options for modifying, deleting, and emailing students, as well as showing diploma verification. Manages pagination to handle large numbers of students.
        - `OverviewSideBar` - Contains filtering and search options:
            - Allows filtering by **Track** and **Bootcamp** to narrow down displayed students.
            - Search input for real-time search of students by name.
            - Email management button to open the **EmailClient** for sending diplomas.
        - `EmailClient` - A dedicated modal for email communication:
            - Configures email content and recipients based on selected students.
            - Supports PDF generation of diplomas for each student and sending them as email attachments.
        - `AlertPopup` and `InfoPopup` - Display custom alerts and informational popups to provide feedback on actions like email sending and student data updates.
    ***Functions and Flow***
        - `Track and Bootcamp Selection` - Users can filter the student view by track and bootcamp, dynamically updating the list and ensuring only relevant students are displayed.
        - `Student Email and Data Management` - Allows users to update student emails, delete students, or send diplomas directly via email. Provides feedback for actions and error handling.
        - `Email Content Configuration` - Users can customize email subject and body, save it for future use, and select specific students for bulk email sending.
    ***Core Methods and Handlers***
        - `modifyStudentEmailHandler` - Validates and updates student email data in the database.
        - `showEmailClientHandler` - Opens the email client modal if a bootcamp is selected, allowing email operations.
        - `sendEmailsHandler` - Sends generated diploma PDFs to selected students' email addresses, using progress tracking and handling cancellations gracefully.
        - `deleteStudentHandler` - Confirms and deletes a student record from the database, providing feedback.
    ***User Interactions***
        - `Searching and Filtering Students` - Users can search by student name and filter by track or bootcamp for a refined list of students.
        - `Emailing Diplomas` - After selecting students, users can send custom email messages with attached diplomas directly from the interface.
    ***Error Handling and Alerts***
        - `Custom Alerts` - Alerts notify users of the success or failure of actions such as student deletion, email sending, and email updates.
        - `Loading Spinner and Error Feedback` - Visual feedback provided during data loading or errors in fetching or sending data.

**VerificationInputPage**  
    ***Components***
        - `DiplomaVerificationInput` - Primary input component for diploma verification:
            - Accepts and manages the user's input for the diploma code.
            - Contains a "Verify" button to submit the entered code.
        - `AlertPopup` - Displays alerts for input validation errors, such as empty submissions, ensuring users receive feedback on their actions.
    ***Functions and Flow***
        - `Diploma Code Input and Validation` - Users can input a diploma code, with validation to prevent empty submissions. Upon valid input, the page navigates to the detailed verification view.
        - `Alert and Error Handling` - Notifies users of issues like empty inputs through the custom alert popup, preventing accidental submissions.

**VerificationPage**  
    ***Components***
        - `DiplomaValidModule` - Displays verified diploma information, including student name, graduation date, and a validity message, ensuring users can visually confirm diploma authenticity.
        - `DiplomaRenderer` - Renders a real-time PDF preview of the diploma using the student's data, including a styled diploma template for an accurate digital representation.
        - `DiplomaDropDown` - Allows users to download the diploma as a PDF after verification, offering an easy method to save a copy.
        - `DiplomaInvalidModule` - Appears if the verification code is invalid, displaying an error message to inform the user.
    ***Functions and Flow***
        - `Diploma Data Fetching and Display` - Fetches diploma data based on the verification code, dynamically populating the view with information like student name, track, and graduation date.
        - `PDF Download` - Users can generate and download the verified diploma as a PDF for record-keeping.
        - `Error Handling` - Provides clear feedback if the diploma verification code is invalid or data retrieval fails, guiding users to correct any issues.
    ***Core Methods and Handlers***
        - `submitHandler` - Submits the entered verification code and navigates to the detailed VerificationPage if valid, handling errors for empty submissions.
        - `generatePDFHandler` - Creates a downloadable PDF version of the verified diploma, supporting long-term storage.
        - `useQuery` - Queries diploma data based on the verification code, ensuring the page updates with verified information or displays an error if the code is invalid.
    ***User Interactions***
        - `Verifying Diplomas` - Users enter a verification code, which upon validation displays diploma details, with options to view or download the diploma as a PDF.
        - `Downloading Diplomas` - Verified diplomas can be downloaded in PDF format directly from the page for easy access and record retention.
    ***Error Handling and Alerts***
        - `AlertPopup for Validation Errors` - Alerts users if they attempt to submit an empty code, preventing invalid inputs.
        - `DiplomaInvalidModule for Verification Errors` - Notifies users if the verification code is invalid, ensuring transparency and guiding them to retry.

**BootcampManagement Page**  
    ***Components***
        - `BootcampsManageForm` - Main form for bootcamp management, containing:
            - `BootcampsTable` - Displays existing bootcamps in a sortable, filterable table with controls to update, delete, or select each bootcamp.
            - `AddNewBootcampForm` - A form to add new bootcamps with inputs for name, graduation date, and track selection, ensuring all necessary data is collected.
            - `BootcampsSectionFooter` - Provides a "Save Changes" button to submit any updates made within the table.
        - `AlertPopup` - Displays alerts for success, error, or validation messages, providing feedback on actions like bootcamp addition or deletion.
        - `ConfirmationPopup` - Asks users for confirmation on actions that may have significant impacts, like bootcamp deletion, to prevent accidental data loss.
    ***Functions and Flow***
        - `Bootcamp Display and Sorting` - Fetches and displays bootcamps, enabling administrators to sort by name, graduation date, or track for efficient management.
        - `Bootcamp Addition and Deletion` - Supports adding new bootcamps and deleting existing ones, updating the database and interface in real-time.
        - `Bootcamp Update and Confirmation` - Allows updating bootcamp details, with a confirmation popup to avoid unintentional changes.
    ***Core Methods and Handlers***
        - `addNewBootcampHandler` - Validates and adds a new bootcamp to the database, triggering success or error alerts based on the result.
        - `handleUpdateBootcamp` - Updates bootcamp data (e.g., name or graduation date), verifying changes and saving them to the backend.
        - `confirmDeleteBootcampHandler` - Confirms and deletes the selected bootcamp, including related data such as diplomas, with alerts and status messages.
    ***User Interactions***
        - `Adding New Bootcamps` - Users can add new bootcamps through a dedicated form, specifying details like graduation date and track, with instant feedback on success or errors.
        - `Editing Bootcamp Details` - Allows users to edit fields within the bootcamp table directly, simplifying data updates for graduation dates and track assignments.
        - `Deleting Bootcamps` - Users can delete a bootcamp, but must confirm the action, ensuring they understand potential consequences (e.g., associated diploma loss).
    ***Error Handling and Alerts***
        - `AlertPopup for Action Feedback` - Provides feedback for all actions (e.g., addition, deletion, update) to inform users about their success or failure.
        - `ConfirmationPopup for Critical Actions` - Protects against accidental deletion or major updates, confirming user intentions for significant changes.

**HistoryPage**  
    ***Components***
        - `HistoryManageTable` - Displays diploma snapshots in a structured table, with features for:
            - Sorting by date, bootcamp name, student count, template name, and status.
            - Filtering snapshots by track or specific search terms.
            - Expanding rows to view student details associated with each snapshot.
            - Option to preview diploma templates and mark them as active.
        - `AlertPopup` - Shows feedback messages for actions like changing the active template or handling errors.
        - `ConfirmationPopup` - Confirms significant actions, such as switching active templates, to prevent unintended updates.
    ***Functions and Flow***
        - `Snapshot Display and Sorting` - Shows diploma generation history with options to sort records, offering quick access to recent or relevant snapshots.
        - `Search and Filtering` - Allows filtering by track or keyword to locate specific bootcamps or student snapshots.
        - `Template Management` - Supports changing the active diploma template for selected bootcamps, aiding in the management of student verification diplomas.
    ***Core Methods and Handlers***
        - `handleRowClick` - Expands or collapses rows to show or hide associated student details within each diploma snapshot.
        - `confirmMakeActiveSnapshot` - Confirms and sets a snapshot as the active diploma template, updating associated records.
        - `handleSortChange` - Changes the sorting criteria for the history list, supporting quick access based on date, bootcamp, or student count.
        - `navigateToVerificationPage` - Opens a separate verification page for each student's diploma, aiding in external validation.
    ***User Interactions***
        - `Viewing and Managing Snapshots` - Users can expand snapshots to view specific student records and navigate to the verification page for additional information.
        - `Changing Active Template` - Administrators can switch the active diploma template, affecting the current diplomas for associated students.
        - `Previewing Diplomas` - Users can preview templates to ensure they are setting the correct diploma design as active.
    ***Error Handling and Alerts***
        - `AlertPopup for Feedback` - Provides success or error messages after actions like updating snapshots or searching.
        - `ConfirmationPopup for Critical Actions` - Asks users to confirm actions that may impact diploma records, like changing active templates.


**TemplateCreatorPage**
    ***Components***
        - `Template Management`
            - `TemplateRenderer` - Handles template visualization and rendering using the Designer component from pdfme. It reflects changes in real time.
            - `EditorLeftSideBar` - Provides shortcuts for adding new fonts and accessing instructional help.
            - `EditorRightSidebar` - Where the magic happens
                - `Browse Tab` - Allows users to switch between templates, add templates, and upload a new PDF background.
                - `Edit Tab` - Provides options for editing layout, font, alignment, and text properties of each field.
        - `Alerts and Confirmations` - Shows feedback messages for actions like changing the active template or handling errors.
            - `AlertPopup` - Displays status messages, such as success, failure, and loading notifications.
            - `ConfirmationPopup` - Ensures that significant actions, like deleting templates or saving changes, require user confirmation.
        - `ConfirmationPopup` - Confirms significant actions, such as switching active templates, to prevent unintended updates.
            - `InstructionSlideshow` - Displays a series of slides guiding users on template creation.
            - `UserFontsClient` - Facilitates the addition of custom fonts for text styling.
     ***Event Handlers***
        - `Template Changes`
            - `templateChangeHandler` - Called when a new template is selected. If there are unsaved changes, it prompts the user to save before switching.
            - `saveTemplate` - Saves the current template to the database, including any layout or field changes.
            - `addTemplate` - Adds a new template to the list. It requires a unique name and uses a blank template structure as the base.
            - `removeTemplate` - Deletes the selected template, preventing deletion of any default or core templates.
        - `Changing Active Template` - Administrators can switch the active diploma template, affecting the current diplomas for associated students.
            - `setPositionXHandler, setPositionYHandler` - Updates the x and y position of selected fields within the template.
            - `setSizeWidthHandler, setSizeHeightHandler` - Adjusts width and height for fields, supporting precise sizing.
            - `setFontColorHandler, setFontHandler, fontSizeHandler` - Handles changes to font color, type, and size, making text appearance customizable.
            - `setAlignVerticalCenter, setAlignHorizontalCenter` - align fields horizontally or vertically within the template bounds.
        - `Previewing Diplomas` - Users can preview templates to ensure they are setting the correct diploma design as active.
            - `pdfFileUploadHandler` - Called when a new PDF is uploaded; it integrates the PDF as the template’s background.
            - `TemplateRenderer` - Manages rendering of templates using Designer. On load or template change, it fetches font data, maps inputs, and initializes the Designer component with the current template.
    ***Additional Utility and Helper Functions***
        - `Data Mapping`
            - `mapTemplatesToTemplateData, createUpdatedTemplate` - assist with formatting and updating template data for efficient handling in the interface.
        - `Event Management`
            - `setFieldEventListeners, handleFieldMouseEvents` - manage click, drag, and mouse events for enhanced interaction with template fields.
    ***Functions and Flow***
        - `Template Selection and Management` - The EditorRightSidebar Browse tab allows users to select and switch between templates. When a user switches templates, unsaved changes trigger a prompt to save or discard edits.
        - `Field Editing and Alignment` - Within the Edit tab, users can modify the position, dimensions, and alignment of individual fields. Options include fine-tuning font color, size, and alignment for an optimal layout.
        - `Real-Time Drag and Drop:` - Fields can be dragged and repositioned on the template canvas. Event listeners monitor for position updates, ensuring that adjustments are captured and reflected in the right sidebar.
    ***File Handling***
        - `PDF Background Upload:` - Users can upload a new PDF background through the PdfFileUpload component. Uploaded PDFs serve as the base for the diploma template, giving each template a custom appearance.
        - `User-Defined Fonts` - Through UserFontsClient, users can upload custom fonts (normal, bold, italic), enhancing diploma text customization.
    ***User Experience Features***
        - `Help and Instructions` - Easily accessible instructional slides and contextual help options guide new users.
        - `Real-Time Feedback:` - Each major action displays an alert (e.g., “Saving Template…”, “Template Updated”) to keep users informed about the system’s state.
        - `Confirmation Prompts` - Confirmation dialogs prevent accidental template deletion or unsaved changes, safeguarding user actions.