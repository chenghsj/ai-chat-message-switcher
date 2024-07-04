import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getStorageData } from '@src/config/storage';

type SizeType = {
  width: number;
  height: number;
};

interface SizeContextType {
  size: SizeType;
  setSize: Dispatch<SetStateAction<SizeType>>;
  isResizing: boolean;
  setIsResizing: Dispatch<SetStateAction<boolean>>;
}

const SizeContext = createContext<SizeContextType | undefined>(undefined);

interface SizeProviderProps {
  children: ReactNode;
  initialSize: SizeType;
}

export const SizeProvider: React.FC<SizeProviderProps> = ({
  children,
  initialSize,
}) => {
  const [size, setSize] = useState<SizeType>(initialSize);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  useEffect(() => {
    const fetchStorageData = async () => {
      const data = await getStorageData();
      if (data?.size) {
        setSize(data.size);
      }
    };

    fetchStorageData();
  }, []);

  return (
    <SizeContext.Provider value={{ size, setSize, isResizing, setIsResizing }}>
      {children}
    </SizeContext.Provider>
  );
};

export const useSizeContext = (): SizeContextType => {
  const context = useContext(SizeContext);
  if (context === undefined) {
    throw new Error('useSizeContext must be used within a SizeProvider');
  }
  return context;
};
