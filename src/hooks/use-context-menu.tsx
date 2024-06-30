import React, { ReactNode, createContext, useContext, useState } from 'react';

interface ContextMenuContextType {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(
  undefined
);

interface ContextMenuProviderProps {
  children: ReactNode;
}

export const ContextMenuProvider: React.FC<ContextMenuProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider
      value={{ isVisible, setIsVisible, position, setPosition }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (context === undefined) {
    throw new Error('useContextMenu must be used within a ContextMenuProvider');
  }
  return context;
};
