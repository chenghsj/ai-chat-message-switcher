import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import {
  Resizable as ResizableComponent,
  ResizeCallbackData,
  ResizeHandle,
} from 'react-resizable';
import 'react-resizable/css/styles.css';
import { setStorageData } from '@src/config/storage';
import { gap } from '@src/config/types';
import { useContextMenuContext } from '@src/hooks/use-context-menu-context';
import { useSizeContext } from '@src/hooks/use-size-context';
import { cn } from '@src/utils/cn';

interface ResizableComponentProps {
  children?: ReactNode;
}

const getHandleClasses = (resizeHandle: ResizeHandle) => {
  const baseClasses = 'absolute h-4 w-4';
  const specificClasses: Record<ResizeHandle, string> = {
    s: 'left-1/2 w-[90%] -translate-x-1/2 bottom-0 cursor-s-resize',
    n: 'left-1/2 w-[90%] -translate-x-1/2 top-0 cursor-n-resize',
    w: 'top-1/2 h-[90%] -translate-y-1/2 left-0 cursor-w-resize',
    e: 'top-1/2 h-[90%] -translate-y-1/2 right-0 cursor-e-resize',
    sw: 'left-0 bottom-0 cursor-sw-resize',
    se: 'right-0 bottom-0 cursor-se-resize',
    nw: 'left-0 top-0 cursor-nw-resize',
    ne: 'right-0 top-0 cursor-ne-resize',
  };

  return cn(baseClasses, specificClasses[resizeHandle]);
};

export const Resizable: FC<ResizableComponentProps> = ({ children }) => {
  const { size: contextMenuSize, setSize, setIsResizing } = useSizeContext();
  const {
    position,
    setPosition,
    isVisible,
    controlPanelSide,
    setOffset,
    offset,
  } = useContextMenuContext();

  const [handles, setHandles] = useState<ResizeHandle[]>(['s', 'w', 'n']);

  useEffect(() => {
    setHandles(
      controlPanelSide === 'right'
        ? ['s', 'w', 'n', 'nw', 'sw']
        : ['s', 'e', 'n', 'ne', 'se']
    );
  }, [controlPanelSide]);

  const handleResize = useCallback(
    (event: React.SyntheticEvent<Element, Event>, data: ResizeCallbackData) => {
      const { width, height } = data.size;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const isNorth = ['n', 'ne', 'nw'].includes(data.handle);
      const isWest = ['w', 'sw', 'nw'].includes(data.handle);

      const newX = isWest
        ? Math.max(position.x + (contextMenuSize.width - width), gap)
        : position.x;
      let newY = isNorth
        ? Math.max(position.y + (contextMenuSize.height - height), gap)
        : position.y;

      const constrainedWidth = Math.min(width, screenWidth - newX - gap);
      let constrainedHeight = Math.min(height, screenHeight - newY - gap);

      if (isNorth) {
        const clientY = (event as unknown as MouseEvent).clientY;
        if (clientY - gap < 0) newY = gap;
        constrainedHeight = Math.min(
          constrainedHeight + (position.y - clientY + gap),
          screenHeight - 2 * gap
        );
      }

      setSize({
        width: constrainedWidth,
        height: constrainedHeight,
      });
      setOffset((prevOffset) => ({
        ...prevOffset,
        x: -constrainedWidth - gap,
      }));
      setPosition({ x: newX, y: newY });
    },
    [contextMenuSize, position, setOffset, setPosition, setSize]
  );

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
  }, [setIsResizing]);

  const handleResizeStop = useCallback(
    async (
      event: React.SyntheticEvent<Element, Event>,
      data: ResizeCallbackData
    ) => {
      await setStorageData((storageData) => ({
        ...storageData,
        size: data.size,
        offset,
      }));
      setIsResizing(false);
    },
    [offset, setIsResizing]
  );

  return (
    <div
      className={cn(
        'absolute select-none',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      style={{ top: position.y, left: position.x }}
    >
      <ResizableComponent
        width={contextMenuSize.width}
        height={contextMenuSize.height}
        onResize={handleResize}
        resizeHandles={handles}
        handle={(resizeHandle, ref) => (
          <div ref={ref} className={getHandleClasses(resizeHandle)} />
        )}
        axis='both'
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
      >
        {children}
      </ResizableComponent>
    </div>
  );
};
