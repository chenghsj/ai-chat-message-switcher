import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getStorageData } from '@src/config/storage';
import { Position } from '@src/config/types';

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

const parsePosition = (pos: string | number, axis: 'x' | 'y'): number => {
  if (typeof pos === 'number') return pos;

  const percentageMatch = pos.match(/([0-9]+)%/);
  const offsetMatch = pos.match(/([-+]?[0-9]+)px$/);
  const operatorMatch = pos.match(/([-+])/);

  if (percentageMatch) {
    const percentage = parseFloat(percentageMatch[1]);
    const offset = offsetMatch ? parseFloat(offsetMatch[1]) : 0;
    const operator = operatorMatch ? operatorMatch[0] : '+';
    const parentSize = axis === 'x' ? window.innerWidth : window.innerHeight;

    return operator === '+'
      ? (parentSize * percentage) / 100 + offset
      : (parentSize * percentage) / 100 - offset;
  }

  return parseFloat(pos);
};

export const DraggableProvider: React.FC<{
  children: ReactNode;
  initialPosition: InitialPosition;
}> = ({ initialPosition, children }) => {
  const [isDraggable, setIsDraggable] = useState(true);
  const [position, setPosition] = useState<Position>({
    x: parsePosition(initialPosition.x, 'x'),
    y: parsePosition(initialPosition.y, 'y'),
  });

  useEffect(() => {
    const initializePosition = async () => {
      const data = await getStorageData();
      setPosition(
        data?.draggedPosition ?? {
          x: parsePosition(initialPosition.x, 'x'),
          y: parsePosition(initialPosition.y, 'y'),
        }
      );
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
