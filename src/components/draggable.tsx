import React, { useCallback, useEffect, useRef } from 'react';
import { setStorageData } from '@src/config/storage';
import { gap } from '@src/config/types';
import {
  RESIZE_TRANSITION_DELAY,
  useWindowResize,
} from '@src/hooks/use-window-size';
import { useDraggable } from '../hooks/use-draggable';

interface DraggableProps {
  triggerId: string;
  children: React.ReactNode;
}

export const Draggable: React.FC<DraggableProps> = ({
  triggerId,
  children,
}) => {
  const { position, setPosition, isDraggable } = useDraggable();
  const { currentSize, previousSize, isResized } = useWindowResize();
  const ref = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);

  const handleMouseMove = useCallback(
    (
      event: MouseEvent,
      initialMouseX: number,
      initialMouseY: number,
      initialElementX: number,
      initialElementY: number
    ) => {
      const deltaX = event.clientX - initialMouseX;
      const deltaY = event.clientY - initialMouseY;

      let newX = initialElementX + deltaX;
      let newY = initialElementY + deltaY;

      const elementWidth = ref.current?.offsetWidth || 0;
      const elementHeight = ref.current?.offsetHeight || 0;

      newX = Math.max(
        gap,
        Math.min(newX, window.innerWidth - elementWidth - gap)
      );
      newY = Math.max(
        gap,
        Math.min(newY, window.innerHeight - elementHeight - gap)
      );

      setPosition({ x: newX, y: newY });
    },
    [setPosition]
  );

  const handleMouseUp = useCallback(
    async (
      event: MouseEvent,
      initialMouseX: number,
      initialMouseY: number,
      initialElementX: number,
      initialElementY: number
    ) => {
      const deltaX = event.clientX - initialMouseX;
      const deltaY = event.clientY - initialMouseY;

      const newX = initialElementX + deltaX;
      const newY = initialElementY + deltaY;

      controller.current?.abort();

      await setStorageData((data) => ({
        ...data,
        draggedPosition: { x: newX, y: newY },
      }));
    },
    []
  );

  const boundMouseMove = useRef<(event: MouseEvent) => void>();
  const boundMouseUp = useRef<(event: MouseEvent) => void>();

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (event.button !== 0 || !isDraggable) return;

      controller.current = new AbortController();
      const { signal } = controller.current;

      const initialMouseX = event.clientX;
      const initialMouseY = event.clientY;
      const initialElementX = position.x;
      const initialElementY = position.y;

      boundMouseMove.current = (moveEvent) =>
        handleMouseMove(
          moveEvent,
          initialMouseX,
          initialMouseY,
          initialElementX,
          initialElementY
        );

      boundMouseUp.current = (moveEvent) =>
        handleMouseUp(
          moveEvent,
          initialMouseX,
          initialMouseY,
          initialElementX,
          initialElementY
        );

      document.addEventListener('mousemove', boundMouseMove.current, {
        signal,
      });
      document.addEventListener('mouseup', boundMouseUp.current, { signal });
    },
    [isDraggable, position, handleMouseMove, handleMouseUp]
  );

  useEffect(() => {
    setPosition({
      ...position,
      x:
        position.x > previousSize.width / 2
          ? position.x + (currentSize.width - previousSize.width)
          : position.x,
    });
  }, [currentSize, previousSize, setPosition]);

  return (
    <div
      id={triggerId}
      ref={ref}
      onMouseDown={handleMouseDown}
      className='absolute z-10 cursor-move select-none'
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isResized
          ? `all ${RESIZE_TRANSITION_DELAY / 1000}s ease`
          : 'none',
      }}
    >
      {children}
    </div>
  );
};
