import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Resizable, ResizeCallbackData, ResizeHandle } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { useContextMenu } from '@src/hooks/use-context-menu';
import { useDraggable } from '@src/hooks/use-draggable';
import { useSize } from '@src/hooks/use-size';
import { cn } from '@src/utils/cn';

interface ResizableComponentProps {
  children?: ReactNode;
}

export const ResizableCompnent: FC<ResizableComponentProps> = ({
  children,
}) => {
  const { size, setSize, setIsResizing, isResizing } = useSize();
  const {
    position,
    setPosition,
    isVisible,
    controlPanelSide,
    setOffset,
    offset,
  } = useContextMenu();

  const [handles, setHandles] = useState<ResizeHandle[]>(['s', 'w', 'n']);

  const handleResize = (
    event: React.SyntheticEvent<Element, Event>,
    data: ResizeCallbackData
  ) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const gap = 5;
    const { width, height } = data.size;
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
      case 's':
        newY = position.y;
        break;
      case 'e':
        newX = position.x;
        break;
      default:
        break;
    }

    const constrainedWidth = Math.min(width, screenWidth - newX - gap);
    const constrainedHeight = Math.min(height, screenHeight - newY - gap);

    setSize({ width: constrainedWidth, height: constrainedHeight });
    // Fix: the resize handle not act as expected
    setOffset({ ...offset, x: -constrainedWidth - gap });
    setPosition({ x: newX, y: newY });
  };

  useEffect(() => {
    // TODO: add corner handles
    setHandles(
      controlPanelSide === 'right' ? ['s', 'w', 'n', 'nw', 'sw'] : ['s', 'e', 'n', 'ne', 'se']
    );
  }, [controlPanelSide]);

  return (
    <div
      className={cn(
        'absolute select-none',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      style={{ top: position.y, left: position.x }}
    >
      <Resizable
        width={size.width}
        height={size.height}
        onResize={handleResize}
        // handle={<CustomHandle />}
        resizeHandles={handles}
        handle={(resizeHandle, ref) => (
          <div
            ref={ref}
            className={cn(
              'absolute',
              {
                'left-1/2 -translate-x-1/2 h-4 w-[90%]': resizeHandle === 's' || resizeHandle === 'n',
                'top-1/2 -translate-y-1/2 h-[90%] w-4': resizeHandle === 'w' || resizeHandle === 'e',
                'w-4 h-4': resizeHandle === 'sw' || resizeHandle === 'se' || resizeHandle === 'nw' || resizeHandle === 'ne',
              },
              resizeHandle === 's' && 'cursor-s-resize bottom-0',
              resizeHandle === 'n' && 'cursor-n-resize top-0',
              resizeHandle === 'w' && 'cursor-w-resize left-0',
              resizeHandle === 'e' && 'cursor-e-resize right-0',
              resizeHandle === 'sw' && 'cursor-sw-resize bottom-0 left-0',
              resizeHandle === 'se' && 'cursor-se-resize bottom-0 right-0',
              resizeHandle === 'nw' && 'cursor-nw-resize top-0 left-0',
              resizeHandle === 'ne' && 'cursor-ne-resize top-0 right-0'
            )}
          />
        )}
        axis='both'
        onResizeStart={() => {
          setIsResizing(true);
        }}
        onResizeStop={() => {
          // prevent the context menu close after stop resizing
          setTimeout(() => {
            setIsResizing(false);
          }, 0);
        }}
      >
        {children}
      </Resizable>
    </div>
  );
};
