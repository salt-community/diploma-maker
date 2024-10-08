**Setup Instructions Integration Testing**
(view in code mode)
***Install .NET 8***
    Step 1 - Install .NET 8.0 https://dotnet.microsoft.com/en-us/download/dotnet/8.0

***Install Docker***
    Step 1 - Install docker desktop https://www.docker.com/products/docker-desktop/

***Check if project builds correctly***
    Step 1 - Inside Frontend/DiplomaMaker.Web.Tests.Integration run -> dotnet build
    Step 2 - Check if docker installed correctly run -> docker --version 

***Setting Up Docker Secrets***
    Step 1 - create new folder called "secrets" in windows root directory ~ so you can navigate to ~/secrets
    Step 2 - create clerk-secretKey.txt clerk-authority.txt clerk-authorizedParty.txt google-credentials.json in the directory
    Step 3 - Paste In some magic
        3.1 - clerk-secretKey.txt -> Login to clerk -> Configure -> API Keys -> Secret keys
        3.2 - clerk-authority.txt -> Configure -> API Keys -> Show API Urls -> Frontend API URL
        3.3 - clerk-authorizedParty.txt -> http://localhost:5173 or whatever frontend docker is running on
        3.4 - google-credentials.json -> Login to console.cloud.google.com -> IAM & Admin -> Service Accounts -> Select the account which has access in our case It's compute@developer.gserviceaccount.com -> Keys -> Add Key -> Create New Key -> JSON -> Download JSON File and paste content into google-credentials

***Setting Up Dotnet User Login Secrets***
    Step 1 - inside clerk -> create or select what account in clerk the tests should login with -> in our case It's the frontend-integrationtesting@serviceaccount.com.
    Step 2 - Fill in the user-secrets (Inside Frontend/DiplomaMaker.Web.Tests.Integration run)
        dotnet user-secrets set "clerk:loginuser" "UserNameFromClerk"
        dotnet user-secrets set "clerk:loginpassword" "UserPasswordFromClerk"

***Getting playwright to work on windows machine (Hard Part)***
    Step 1 - Download Powershell https://github.com/PowerShell/PowerShell/releases
    Step 2 - Find C:/ProgramFiles/Powershell/VersionXX/pwsh.exe right click *copy as path*
    Step 3 - Go to win menu "Edit system enviroment variables" -> Env Variables -> System Variables -> Path -> Edit -> New -> *Paste in the path*
    Step 3 - Run powershell terminal OBS MAKE SURE IT'S NOT Windows Powershell but the Powershell you just installed!
        you can check if you are in the right terminal by running -> pwsh
    Step 4 - Navigate to DiplomaMaker.Web.Tests.Integration\bin\Debug\net8.0 
    Step 5 - Run -> pwsh playwright.ps1 install - This installs the playwright browser plugin on your system

***Running the tests***
    inside Frontend run -> docker-compose -f docker-compose.integration.yml build (This builds the database, backend and frontend so might take a little time if first run, grab some coffee)
    inside Frontend/DiplomaMaker.Web.Tests.Integration run -> dotnet test

***Known Bugs***
    Error 1 cannot find entrypoint.sh 
        - If the backend cannot connect to the database most likely you are getting an error 1 cannot find entrypoint.sh or something similar. The fix to this is to literally delete the file, build and then re add the same exact file and rebuild again. Currently no idea why this happens.

***Useful Commands***
    To test the docker-compose.integration.yml is running the way it is supposed to
        docker-compose -f docker-compose.integration.yml down
        docker-compose -f docker-compose.integration.yml up --build