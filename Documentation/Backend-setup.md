(read in code mode)

***Install .NET 8***
    Step 1 - Install .NET 8.0 https://dotnet.microsoft.com/en-us/download/dotnet/8.0

***Install Docker***
    Step 1 - Install docker desktop https://www.docker.com/products/docker-desktop/
    Step 2 - Check if docker installed correctly run -> docker --version 

***Install Google CLI***
    Step 1 - Install the gcloud CLI https://cloud.google.com/sdk/docs/install
    Step 2 - Restart computer -> run -> gcloud init (You might need to run it in their terminal or different terminal depending on how much google hates you today)
    Step 3 - Inside /Backend/DiplomaMakerApi run -> gcloud auth login
    Step 4 - Make sure you set the correct google cloud project run -> gcloud config set project [PROJECT_ID]

***Build & Start PostgreSQL Container***
    Step 1 - Inside /Backend run -> docker-compose -f docker-compose-postgres.yml up -d

***Check if project builds correctly***
    Step 1 - Inside /Backend/DiplomaMakerApi run -> dotnet build

***Setup Clerk secrets in .NET User Secrets***
    Step 1 - Inside /Backend/DiplomaMakerApi run -> dotnet user-secrets init
    Step 2 - Add Clerk SecretKey, Authority and AuthorizedParty
        2.1 - clerk secretKey -> Login to clerk -> Configure -> API Keys -> Secret keys
            dotnet user-secrets set "Clerk:SecretKey" "YOURKEY"
        2.2 - clerk authority -> Configure -> API Keys -> Show API Urls -> Frontend API URL
            dotnet user-secrets set "Clerk:Authority" "YOURAUTHORITY"
        2.3 - clerk authorizedParty -> http://localhost:5173 or whatever frontend is running on
            dotnet user-secrets set "Clerk:AuthorizedParty" "YOURAUTHPARTY"

***Run project***
    Step 1 - Inside /Backend/DiplomaMakerApi run -> dotnet run

***OPTIONAL: For future database migrations!: Setup Database Connection Strings in .NET User Secrets***
    We use one real live database for production and another one for development in this project for testing purposes. We also have two Google Cloud API's one for development and one for production for the same reason.
    
    Step 1 - Login to Supabase and find your development db connectionstring
        step 1.1 - dotnet user-secrets set "ConnectionStrings:PostgreSQLConnection" "DEVELOPMENT_CONNECTION"
        step 1.2 - dotnet user-secrets set "ConnectionStrings:PostgreSQLConnectionProduction" "PRODUCTION_CONNECTION"
        ***IMPORTANT*** Make sure you add these three to the end of each connectionstring.
            Pooling=false;Timeout=300;CommandTimeout=300