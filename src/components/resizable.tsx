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
        newY = Math.max(position.y + (size.height - height), gap);
        break;
      case 'w':
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
      controlPanelSide === 'right' ? ['s', 'w', 'n'] : ['s', 'e', 'n']
    );
  }, [controlPanelSide]);

  return (
    <div
      className={cn(
        'absolute',
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
              resizeHandle === 's' || resizeHandle === 'n'
                ? 'left-0 h-4 w-full cursor-row-resize'
                : 'top-0 h-full w-4 cursor-col-resize',
              resizeHandle === 's' && 'bottom-0',
              resizeHandle === 'n' && 'top-0',
              resizeHandle === 'w' && 'left-0',
              resizeHandle === 'e' && 'right-0'
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
