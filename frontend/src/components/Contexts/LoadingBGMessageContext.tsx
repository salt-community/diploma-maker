import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LoadingBGMessageContextType {
  loadingBGMessage: string;
  setBGLoadingMessage: (message: string) => void;
}

const LoadingBGMessageContext = createContext<LoadingBGMessageContextType | undefined>(undefined);

export const LoadingBGMessageProvider = ({ children }: { children: ReactNode }) => {
  const [loadingBGMessage, setBGLoadingMessage] = useState('');

  return (
    <LoadingBGMessageContext.Provider value={{ loadingBGMessage, setBGLoadingMessage }}>
      {children}
    </LoadingBGMessageContext.Provider>
  );
};

export const useBGLoadingMessage = () => {
  const context = useContext(LoadingBGMessageContext);
  if (!context) {
    throw new Error('useBGLoadingMessage must be used within a LoadingMessageProvider');
  }
  return context;
};