import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getStorageData, setStorageData } from '@src/config/storage';
import { contextMenuId } from '@src/config/types';

interface DraggableLabelValueContextType {
  opacity: number;
  setOpacity: React.Dispatch<React.SetStateAction<number>>;
  handleMouseDown: (e: React.MouseEvent<HTMLSpanElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DraggableLabelValueContext = createContext<
  DraggableLabelValueContextType | undefined
>(undefined);

interface DraggableLabelValueProviderProps {
  children: ReactNode;
  initialOpacity: number;
}

export const step = 0.01;
export const min = 0.05;
export const max = 1;

export const DraggableLabelValueProvider: React.FC<
  DraggableLabelValueProviderProps
> = ({ children, initialOpacity }) => {
  const [opacity, setOpacity] = useState<number>(initialOpacity);
  const valueRef = useRef(opacity);
  const startValueRef = useRef<number>(0);
  const startXRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
    startXRef.current = e.clientX;
    startValueRef.current = opacity;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const diff = e.clientX - startXRef.current;
    const newValue = startValueRef.current + diff * step;
    setOpacity(Math.min(Math.max(Number(newValue.toFixed(2)), min), max));
  };

  const handleMouseUp = () => {
    const contextMenu = document.getElementById(contextMenuId);
    if (contextMenu) {
      contextMenu.style.opacity = '1';
    }
    setStorageData((data) => ({
      ...data,
      opacity: valueRef.current,
    }));
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(Number(e.target.value));
  };

  useEffect(() => {
    valueRef.current = opacity;
  }, [opacity]);

  useEffect(() => {
    getStorageData().then((data) => {
      setOpacity(data.opacity ?? initialOpacity);
    });
  }, []);

  return (
    <DraggableLabelValueContext.Provider
      value={{ opacity, setOpacity, handleMouseDown, handleInputChange }}
    >
      {children}
    </DraggableLabelValueContext.Provider>
  );
};

export const useDraggableLabelValueContext =
  (): DraggableLabelValueContextType => {
    const context = useContext(DraggableLabelValueContext);
    if (!context) {
      throw new Error(
        'useDraggableLabelValueContext must be used within a DraggableLabelValueProvider'
      );
    }
    return context;
  };
