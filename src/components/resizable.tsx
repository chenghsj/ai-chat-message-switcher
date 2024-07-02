import React, { FC, ReactNode, useEffect, useState } from 'react';
import {
  Resizable as ResizableComponent,
  ResizeCallbackData,
  ResizeHandle,
} from 'react-resizable';
import 'react-resizable/css/styles.css';
import { setStorageData } from '@src/config/storage';
import { useContextMenu } from '@src/hooks/use-context-menu';
import { useSize } from '@src/hooks/use-size';
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
  const { size, setSize, setIsResizing } = useSize();
  const {
    position,
    setPosition,
    isVisible,
    controlPanelSide,
    setOffset,
    offset,
  } = useContextMenu();

  const [handles, setHandles] = useState<ResizeHandle[]>(['s', 'w', 'n']);

  useEffect(() => {
    setHandles(
      controlPanelSide === 'right'
        ? ['s', 'w', 'n', 'nw', 'sw']
        : ['s', 'e', 'n', 'ne', 'se']
    );
  }, [controlPanelSide]);

  const handleResize = (
    event: React.SyntheticEvent<Element, Event>,
    data: ResizeCallbackData
  ) => {
    const { width, height } = data.size;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const gap = 5;
    let newX = position.x;
    let newY = position.y;

    switch (data.handle) {
      case 'n':
      case 'ne':
        newY = Math.max(position.y + (size.height - height), gap);
        break;
      case 'w':
      case 'sw':
        newX = Math.max(position.x + (size.width - width), gap);
        break;
      case 'nw':
        newY = Math.max(position.y + (size.height - height), gap);
        newX = Math.max(position.x + (size.width - width), gap);
        break;
      default:
        break;
    }

    const constrainedWidth = Math.min(width, screenWidth - newX - gap);
    const constrainedHeight = Math.min(height, screenHeight - newY - gap);

    setSize({ width: constrainedWidth, height: constrainedHeight });
    setOffset({ ...offset, x: -constrainedWidth - gap })
    setPosition({ x: newX, y: newY });
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = async (
    event: React.SyntheticEvent<Element, Event>,
    data: ResizeCallbackData
  ) => {
    await setStorageData((storageData) => ({
      ...storageData,
      size: data.size,
    }));

    setIsResizing(false);
  };

  return (
    <div
      className={cn(
        'absolute select-none',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      style={{ top: position.y, left: position.x }}
    >
      <ResizableComponent
        width={size.width}
        height={size.height}
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

// TODO: show size info while resizing
