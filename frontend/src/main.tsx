import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "react-query";
import { LoadingMessageProvider } from './components/Contexts/LoadingMessageContext.tsx';
import { LoadingBGMessageProvider } from './components/Contexts/LoadingBGMessageContext.tsx';

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LoadingMessageProvider>
          <LoadingBGMessageProvider>
            <App />
          </LoadingBGMessageProvider>
        </LoadingMessageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
