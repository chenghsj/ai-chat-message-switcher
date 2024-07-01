import React, { ReactNode, createContext, useContext, useState } from 'react';

type ControlPanelSide = 'left' | 'right';

interface ContextMenuContextType {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  controlPanelSide: ControlPanelSide;
  setControlPanelSide: React.Dispatch<React.SetStateAction<ControlPanelSide>>;
  offset: { x: number; y: number };
  setOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  pinned: boolean;
  setPinned: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [controlPanelSide, setControlPanelSide] =
    useState<ControlPanelSide>('right');
  // the offset is used to adjust the position of the context menu relative to the trigger element
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [pinned, setPinned] = useState(false);

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

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (context === undefined) {
    throw new Error('useContextMenu must be used within a ContextMenuProvider');
  }
  return context;
};
