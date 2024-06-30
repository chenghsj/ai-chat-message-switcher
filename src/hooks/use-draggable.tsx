import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { storage } from '@src/config/stroage';

interface DraggableContextProps {
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  isDraggable: boolean;
  setIsDraggable: React.Dispatch<React.SetStateAction<boolean>>;
}

const DraggableContext = createContext<DraggableContextProps | undefined>(
  undefined
);

export const DraggableProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isDraggable, setIsDraggable] = useState(true);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    chrome.storage.local.get(storage.GPT_PANEL_DRAGGABLE, (data) => {
      setIsDraggable(data[storage.GPT_PANEL_DRAGGABLE] ?? true);
    });
  }, []);

  return (
    <DraggableContext.Provider
      value={{ position, setPosition, isDraggable, setIsDraggable }}
    >
      {children}
    </DraggableContext.Provider>
  );
};

export const useDraggable = () => {
  const context = useContext(DraggableContext);
  if (context === undefined) {
    throw new Error('useDraggable must be used within a DraggableProvider');
  }
  return context;
};
