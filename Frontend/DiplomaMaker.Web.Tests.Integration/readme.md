**Getting playwright to work on windows machine**
step 1 - Download Powershell,
step 2 - Find C:/ProgramFiles/Powershell/VersionXX/pwsh.exe right click *copy as path*
step 3 - Go to win menu "Edit system enviroment variables" -> Env Variables -> System Variables -> Path -> Edit -> New -> *Paste in the path*
step 3 - Run powershell terminal
step 4 - Navigate to DiplomaMaker.Web.Tests.Integration\bin\Debug\net8.0 
step 5 - Run -> pwsh playwright.ps1 install