import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getStorageData } from '@src/config/storage';
import { Position, parsedInitialPosition } from '@src/config/types';

interface InitialPosition {
  x: string | number;
  y: string | number;
}

interface DraggableContextProps {
  initialPosition: InitialPosition;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  isDraggable: boolean;
  setIsDraggable: React.Dispatch<React.SetStateAction<boolean>>;
}

const DraggableContext = createContext<DraggableContextProps | undefined>(
  undefined
);

export const DraggableProvider: React.FC<{
  children: ReactNode;
  initialPosition: InitialPosition;
}> = ({ initialPosition, children }) => {
  const [isDraggable, setIsDraggable] = useState(true);
  const [position, setPosition] = useState<Position>(parsedInitialPosition);

  useEffect(() => {
    const initializePosition = async () => {
      const data = await getStorageData();
      setPosition(data?.draggedPosition ?? parsedInitialPosition);
      setIsDraggable(data?.draggable ?? true);
    };

    initializePosition();
  }, [initialPosition]);

  return (
    <DraggableContext.Provider
      value={{
        position,
        setPosition,
        isDraggable,
        setIsDraggable,
        initialPosition,
      }}
    >
      {children}
    </DraggableContext.Provider>
  );
};

export const useDraggable = () => {
  const context = useContext(DraggableContext);
  if (!context) {
    throw new Error('useDraggable must be used within a DraggableProvider');
  }
  return context;
};
