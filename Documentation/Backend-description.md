(read in code mode)

**Data Structure**
    Track
        Id - 5
        Name - C# Dotnet
        Tag - dnfs
        List of Bootcamps -
            guidId - af1fe79b-6ec3-450f-81f5-5d2fdc1894d9
            graduationDate - 2024-08-31T00:00:00Z
            name - dnfs-2024-08-31
            track - foreign key to track
            templateId - x
            List of Students
                guidId - c2cd18b1-bf4c-4441-a006-bb6ae2c28754
                verificationCode - 19aa9
                name - Bob Ryder
                email - Bob.ryder@gmail.com
                previewImageUrl - ImagePreview/guidid.webp
                previewImageLQIPUrl - ImagePreviewLQIP/guidid.webp
                lastGenerated - date user last clicked "generate" for bootcamp with this student

    Template
        Id - 2
        Name - MyAmazingBeautifulTemplate
        footer - TextContent of footer inside template ex "has successfully graduated from {classname}"
        footerstyling (tells the frontend editor/viewer what to do)
            id - 33
            xPos - 24.51
            yPos - 142.72
            width - 165.33
            height - 26.38
            fontSize - 17
            fontColor - #ffffff
            fontName - montserrat (This is the font used)
            alignment - center (where inside the field the text is aligned)
        intro - same thing
        introStyling - same thing
        main - here we only have {studentname}
        mainStyling
        link - This is where the little verificationcode lives
        linkStyling
        basePdf - "Blob/MyAmazingBeautifulTemplate.pdf" (URL to where the .pdf blob exists in blob storage)
        lastUpdated - 2024-08-02T09:34:15.581852Z
        pdfBackgroundLastUpdated - 2024-08-02T09:34:14.972Z

**Controllers Basics**
    ***TracksController***
        - Frontend uses GetTracks as basedata on almost all pages
    ***TemplatesController***
        - GetTemplates contains all the styling properties & textcontent for diplomas. 
        - Frontend then pairs the right template to the right bootcamp with tracks.bootcamps.templateId.
    ***BootcampsController***
        - UpdatePreviewData is called on DiplomaMaking page when clicking "Generate". It updates bootcamp with new/existing students.
    ***BlobController***
        - GetPdfBlob is needed to load template pdf correctly. it uses the Template.basePdf address to fetch the pdf background file from localstorage/googleblobstorage of the template in question.

**Services Basics**
    **TrackService** - Handles retrieval of all tracks, including associated bootcamp, student, and diploma template information.
        ***Methods***
            - `GetAllTracks` Fetches a list of all tracks in the system, each with related bootcamp data, and further includes each bootcamp's list of students and its linked diploma template.
    ***TemplateService** - Manages CRUD operations for diploma templates, including handling styling details and storage of PDF files.
        ***Methods***
            - `GetTemplates` - Retrieves all diploma templates, including styling information for intro, main, footer, and link sections.
            - `GetTemplate` - Fetches a single diploma template by its ID.
            - `PostTemplate` - Creates a new diploma template with the specified name and initializes a PDF file in storage. Chooses between local or cloud storage based on configuration.
            - `PutTemplate` - Updates an existing template with new content and styling details. Converts and saves a new PDF file from a base64 string, updating the storage as needed.
            - `DeleteTemplate` - Deletes a template by its ID, removing the associated PDF file from storage.
    **BootcampService** - Handles CRUD operations for bootcamps, including managing preview images for students and updating templates.
        ***Methods***
            - `PostBootcamp` - Creates a new bootcamp with a specified track and a default diploma template. Throws an exception if the track or default template does not exist.
            - `GetBootcamps` - Retrieves a list of all bootcamps with their associated students, track, and diploma template.
            - `GetBootcampByGuidId` - Fetches a bootcamp by its `GuidId`, including its associated students, track, and diploma template.
            - `DeleteBootcampByGuidId` - Deletes a bootcamp by its `GuidId`. Throws a `NotFoundByGuidException` if the bootcamp does not exist.
            - `UpdateBootcampTemplate` - Updates the diploma template for a bootcamp by its `GuidId`. Throws exceptions if the bootcamp or template is not found.
            - `PutBootcampAsync` - Updates an existing bootcamp with new track and graduation date information.
            - `PutStudentsPreviewImages` - Updates the preview images for multiple students in a bootcamp.
            - `PutStudentPreviewImage` - Updates the preview image for a single student by converting a base64-encoded PDF to WebP format and saving it either locally or to cloud storage.
    **StudentService** - Handles CRUD operations for students, including searching, updating, and managing their association with bootcamps.
        ***Methods***
            - `ReplaceStudents` - Replaces all students in a specified bootcamp with a new list from the request, creating a history snapshot of the bootcamp's student data.
            - `GetAllStudents` - Retrieves all students, including their associated bootcamp data.
            - `GetStudentsByKeyword` - Searches for students by name or their bootcamp’s track name based on a keyword.
            - `GetStudentByGuidId` - Fetches a student by their unique `GuidId`, including bootcamp association. Throws an exception if the student is not found.
            - `GetStudentByVerificationCode` - Finds a student by their unique verification code, including bootcamp association.
            - `DeleteStudentByGuidId` - Deletes a student by their unique `GuidId`. Throws an exception if the student is not found.
            - `UpdateStudent` - Updates a student’s name and email by their `GuidId`.
    ***LocalFileStorageService*** - Handles file storage operations for templates, including saving, retrieving, and deleting files locally. In this case diploma PDF Backgrounds.
        **Methods**
            - `GetFilePath` - Retrieves the file path for a given template name within a specified subdirectory. Initializes a new file from a template if the file does not exist.
            - `GetFilesFromPath` - Creates a zip file from all files in a specified subdirectory and returns it for download.
            - `SaveFile` - Saves an uploaded file to a specified subdirectory, creating the directory if it doesn’t already exist.
            - `DeleteFile` - Deletes a specified file by template name, ensuring the default template cannot be deleted.
            - `InitFileFromNewTemplate` - Copies the default template file to initialize a new template file in the specified subdirectory.
            - `CreateBackup` - Creates a versioned backup of a specified file by copying it to a new file with a versioned name.
            - `ClearFolderExceptDefault` - Deletes all files in a specified subdirectory except for the default template file.
            - `SetupBlobFolder` - Sets up the blob folder by copying files from a source blob directory to the designated storage directory.
    ***GoogleCloudStorageService*** - A mirror of LocalFileStorageService - It Literally does the same thing except with Google Blob Storage
        **Methods**
            - `GetFilePath` - Retrieves the storage path for a specific file in the bucket. Initializes a file from a template if it does not exist.
            - `GetFileFromFilePath` - Downloads a file from Google Cloud Storage by its path and returns it as a byte array with content type.
            - `SaveFile` - Uploads a file to Google Cloud Storage, placing it in a specified subdirectory and appending the appropriate extension.
            - `DeleteFile` - Deletes a specified file in the bucket, ensuring the default template cannot be deleted.
            - `InitFileFromNewTemplate` - Copies the default template file to initialize a new template file in the specified subdirectory in Google Cloud Storage.
            - `CreateBackup` - Creates a versioned backup of a specified file by copying it to a new file with a versioned name.
            - `GetFilesFromPath` - Creates a zip file containing all files in a specified storage folder and returns it for download.
    ***FileUtilityService*** - Provides utility functions for file processing, including PDF to PNG conversion, image format transformation, zip file creation, and validation.
        **Methods**
            - `CreateZipFromFiles` - Creates a zip file from a collection of file paths and returns it as a byte array.
            - `CreateZipFromStreams` - Creates a zip file from a collection of file streams and filenames.
            - `ConvertPngToWebP` - Converts a PNG image to WebP format, supporting optional low-quality conversion for smaller file sizes.
            - `GetRelativePathAsync` - Generates a relative path for a given full file path, based on a specified directory name.
            - `ConvertPdfToPng` - Converts a PDF from a base64 string to a PNG image and returns it as an `IFormFile`.
            - `ConvertByteArrayToIFormFile` - Converts a byte array to an `IFormFile` with a specified filename and content type.
            - `IsValidBase64Pdf` - Validates if a given base64 string represents a valid PDF file.
    ***UserFontService*** - Manages the storage and retrieval of custom user-uploaded fonts, including handling local or cloud storage.
        **Methods**
            - `GetUserFonts` - Retrieves all user fonts stored in the system.
            - `PostUserFonts` - Adds a list of user fonts from the request, storing each file either locally or in cloud storage based on configuration.
    ***EmailService*** - Handles sending emails with attachments via Gmail, using OAuth for authentication.
        **Methods**
            - `SendEmailWithAttachmentAsync` - Sends an email with an attachment to a specified student based on their unique GUID. Populates the email with a title, description and pdf-file.
    ***ClerkService*** - Interacts with the Clerk API to retrieve OAuth tokens for users.
        **Methods**
            - `GetGoogleOAuthTokenAsync` - Fetches the Google OAuth token for a specified user from Clerk using a provided API key.
    ***HistorySnapshotService*** - Manages creation, retrieval, and activation of history snapshots for diploma templates and students. One snapshot is a single student at a given diploma generation time. (A form of Version Control for each student generated)
        **Methods**
            - `CreateHistorySnapshotFromBootcamp` - Creates historical snapshots for each student in a bootcamp based on the specified template and current state.
            - `GetFileLocation` - Retrieves the file path of a specified template, adjusting based on storage location (local or cloud).
            - `GetHistorySnapshots` - Retrieves all history snapshots with their styling details.
            - `GetHistorySnapshotsByVerificationCode` - Fetches history snapshots based on a student's verification code. Throws an exception if no matching snapshots are found.
            - `MakeActiveHistorySnapshot` - Activates specified snapshots, deactivating any previously active snapshots for the given students.
    ***DatabasePokeService*** - Periodically verifies the database connection by attempting to retrieve records, ensuring connectivity.
        **Methods**
            - `StartAsync` - Begins the timer that triggers the `PokeDatabase` method at regular intervals (every hour).
            - `PokeDatabase` - Checks database connectivity by attempting to fetch records from the `Tracks` table. Logs the result of the connection attempt.
            - `StopAsync` - Stops the timer when the service is stopped.
            - `Dispose` - Disposes of the timer when the service is disposed.