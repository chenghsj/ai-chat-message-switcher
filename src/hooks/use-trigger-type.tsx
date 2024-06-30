// TriggerTypeContext.tsx
import React, { ReactNode, createContext, useContext, useState } from 'react';

type TriggerType = 'panel-click' | 'context-menu-click' | 'window-scroll';

interface TriggerTypeContextType {
  triggerType: TriggerType;
  setTriggerType: React.Dispatch<React.SetStateAction<TriggerType>>;
}

const TriggerTypeContext = createContext<TriggerTypeContextType | undefined>(
  undefined
);

interface TriggerTypeProviderProps {
  children: ReactNode;
}

export const TriggerTypeProvider: React.FC<TriggerTypeProviderProps> = ({
  children,
}) => {
  const [triggerType, setTriggerType] = useState<TriggerType>('window-scroll');

  return (
    <TriggerTypeContext.Provider value={{ triggerType, setTriggerType }}>
      {children}
    </TriggerTypeContext.Provider>
  );
};

export const useTriggerType = () => {
  const context = useContext(TriggerTypeContext);
  if (context === undefined) {
    throw new Error('useTriggerType must be used within a TriggerTypeProvider');
  }
  return context;
};
