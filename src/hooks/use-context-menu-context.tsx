import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getStorageData } from '@src/config/storage';
import { Position } from '@src/config/types';

type ControlPanelSide = 'left' | 'right';

interface ContextMenuContextType {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  controlPanelSide: ControlPanelSide;
  setControlPanelSide: React.Dispatch<React.SetStateAction<ControlPanelSide>>;
  offset: Position;
  setOffset: React.Dispatch<React.SetStateAction<Position>>;
  pinned: boolean;
  setPinned: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(
  undefined
);

interface ContextMenuProviderProps {
  children: ReactNode;
  initialPosition: Position;
}

export const ContextMenuProvider: React.FC<ContextMenuProviderProps> = ({
  children,
  initialPosition,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [controlPanelSide, setControlPanelSide] =
    useState<ControlPanelSide>('right');
  // the offset is used to adjust the position of the context menu relative to the trigger element
  const [offset, setOffset] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    getStorageData().then((data) => {
      if (data?.pinned) {
        setIsVisible(true);
      }
      setPinned(data?.pinned ?? false);
    });
  }, []);

  return (
    <ContextMenuContext.Provider
      value={{
        isVisible,
        setIsVisible,
        position,
        setPosition,
        controlPanelSide,
        setControlPanelSide,
        offset,
        setOffset,
        pinned,
        setPinned,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
};

export const useContextMenuContext = () => {
  const context = useContext(ContextMenuContext);
  if (context === undefined) {
    throw new Error(
      'useContextMenuContext must be used within a ContextMenuProvider'
    );
  }
  return context;
};
