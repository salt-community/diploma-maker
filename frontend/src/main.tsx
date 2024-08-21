import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "react-query";
import { LoadingMessageProvider } from './components/Contexts/LoadingMessageContext.tsx';
import { LoadingBGMessageProvider } from './components/Contexts/LoadingBGMessageContext.tsx';
import { ClerkProvider } from '@clerk/clerk-react';

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <QueryClientProvider client={queryClient}>
            <LoadingMessageProvider>
              <LoadingBGMessageProvider>
                <App />
              </LoadingBGMessageProvider>
            </LoadingMessageProvider>
          </QueryClientProvider>
        </ClerkProvider>
      </BrowserRouter>
  </React.StrictMode>
)
