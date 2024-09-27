**Setup Instructions For E2E Testing**
***Install .NET 8***
    Step 1 - Install .NET 8.0 https://dotnet.microsoft.com/en-us/download/dotnet/8.0

***Install Docker***
    Step 1 - Install docker desktop https://www.docker.com/products/docker-desktop/

***Check if project builds correctly***
    Step 1 - Inside Backend/DiplomaMakerApi.Tests.Integration run -> dotnet build
    Step 2 - Check if docker installed correctly run -> docker --version 

***Running the tests***
    inside Backend/DiplomaMakerApi.Tests.Integration run -> dotnet test

***Useful Commands***
    To test the docker-compose.integration.yml is running the way it is supposed to
        docker-compose -f docker-compose.integration.yml down
        docker-compose -f docker-compose.integration.yml up --build