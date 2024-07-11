import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "react-query";
import { LoadingMessageProvider } from './components/Contexts/LoadingMessageContext.tsx';

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LoadingMessageProvider>
          <App />
        </LoadingMessageProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
