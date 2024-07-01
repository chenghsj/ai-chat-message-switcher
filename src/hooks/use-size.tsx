// SizeContext.tsx
import React, { ReactNode, createContext, useContext, useState } from 'react';

type SizeType = {
  width: number;
  height: number;
};

interface SizeContextType {
  size: SizeType;
  setSize: React.Dispatch<React.SetStateAction<SizeType>>;
  isResizing: boolean;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
}

const SizeContext = createContext<SizeContextType | undefined>(undefined);

interface SizeProviderProps {
  children: ReactNode;
  initialSize: SizeType;
}

const defaultSize = { width: 400, height: 400 };

export const SizeProvider: React.FC<SizeProviderProps> = ({
  children,
  initialSize = defaultSize,
}) => {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);

  return (
    <SizeContext.Provider value={{ size, setSize, isResizing, setIsResizing }}>
      {children}
    </SizeContext.Provider>
  );
};

export const useSize = () => {
  const context = useContext(SizeContext);
  if (context === undefined) {
    throw new Error('useSize must be used within a SizeProvider');
  }
  return context;
};
