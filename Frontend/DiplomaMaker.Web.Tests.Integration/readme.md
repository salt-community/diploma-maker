**Setup Instructions**
***Install .NET 8***
    Step 1 - Install .NET 8.0 https://dotnet.microsoft.com/en-us/download/dotnet/8.0

***Install Docker***
    Step 1 - Install docker desktop https://www.docker.com/products/docker-desktop/

***Setting Up Docker Secrets***
    Step 1 - create new folder called "secrets" in root directory ~ so you can navigate to ~/secrets
    Step 2 - create clerk-secretKey.txt clerk-authority.txt clerk-authorizedParty.txt google-credentials.json in the directory
    Step 3 - Paste In some magic
        3.1 - clerk-secretKey.txt -> Login to clerk -> Configure -> API Keys -> Secret keys
        3.2 - clerk-authority.txt -> Configure -> API Keys -> Show API Urls -> Frontend API URL
        3.3 - clerk-authorizedParty.txt -> http://localhost:5173 or whatever frontend docker is running on
        3.4 - google-credentials.json -> Login to console.cloud.google.com -> IAM & Admin -> Service Accounts -> Select the account which has access in our case It's compute@developer.gserviceaccount.com -> Keys -> Add Key -> Create New Key -> JSON -> Download JSON File and paste content into google-credentials

***Setting Up Dotnet User Login Secrets***
    Step 1 - inside clerk -> create or select what account in clerk the tests should login with -> in our case It's the frontend-integrationtesting@serviceaccount.com.
    Step 2 - Fill in the user-secrets (Inside Frontend/DiplomaMaker.Web.Tests.E2E run)
        dotnet user-secrets set "clerk:loginuser" "UserNameFromClerk"
        dotnet user-secrets set "clerk:loginpassword" "UserPasswordFromClerk"

***Getting playwright to work on windows machine (Hard Part)***
    Step 1 - Download Powershell,
    Step 2 - Find C:/ProgramFiles/Powershell/VersionXX/pwsh.exe right click *copy as path*
    Step 3 - Go to win menu "Edit system enviroment variables" -> Env Variables -> System Variables -> Path -> Edit -> New -> *Paste in the path*
    Step 3 - Run powershell terminal
    Step 4 - Navigate to DiplomaMaker.Web.Tests.Integration\bin\Debug\net8.0 
    Step 5 - Run -> pwsh playwright.ps1 install

***Running the tests***
    inside Frontend/DiplomaMaker.Web.Tests.E2E run -> dotnet test