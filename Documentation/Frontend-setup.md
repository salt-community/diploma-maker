(read in code mode)

***Setup npm***
    Step 1 - install npm run -> npm install -g npm

***Setup Node***
    Step 1 - Install Node Version v20.11.1 https://nodejs.org/en/blog/release/v20.11.1
    Tip: Use Node Version Manager to shift between node versions easily - https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/

***Setup Enviroment Variables***
    Inside DiplomaMaker.Web/.env.development we have the env variables used for clerk and the API
    .env.production is for when the frontend is deployed up at vercel

    Step 1 - Make sure VITE_API_URL points to the root host of the DiplomaMakerApi backend address
    Step 2 - Make sure VITE_CLERK_PUBLISHABLE_KEY is same as in clerk
        login to clerk -> Configure -> API Keys -> Publishable key

***Install Dependencies and Run***
    Step 1 - Inside /DiplomaMaker.Web - run -> npm i
    Step 2 - Start the frontend - run -> npm run dev