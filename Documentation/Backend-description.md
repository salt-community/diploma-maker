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
    ***TrackService***
    ***TemplateService***
    ***BootcampService***
    ***BlobService***