import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LoadingMessageContextType {
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
}

const LoadingMessageContext = createContext<LoadingMessageContextType | undefined>(undefined);

export const LoadingMessageProvider = ({ children }: { children: ReactNode }) => {
  const [loadingMessage, setLoadingMessage] = useState('');

  return (
    <LoadingMessageContext.Provider value={{ loadingMessage, setLoadingMessage }}>
      {children}
    </LoadingMessageContext.Provider>
  );
};

export const useLoadingMessage = () => {
  const context = useContext(LoadingMessageContext);
  if (!context) {
    throw new Error('useLoadingMessage must be used within a LoadingMessageProvider');
  }
  return context;
};