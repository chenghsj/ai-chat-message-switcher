import React, { useCallback, useRef } from 'react';
import { setStorageData } from '@src/config/storage';
import { gap } from '@src/config/types';
import { useDraggableContext } from '../hooks/use-draggable-context';

interface DraggableProps {
  triggerId: string;
  children: React.ReactNode;
}

export const Draggable: React.FC<DraggableProps> = ({
  triggerId,
  children,
}) => {
  const { position, setPosition, isDraggable } = useDraggableContext();
  const ref = useRef<HTMLDivElement>(null);

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

      document.removeEventListener('mousemove', boundMouseMove.current!);
      document.removeEventListener('mouseup', boundMouseUp.current!);

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

      document.addEventListener('mousemove', boundMouseMove.current);
      document.addEventListener('mouseup', boundMouseUp.current);
    },
    [isDraggable, position, handleMouseMove, handleMouseUp]
  );

  return (
    <div
      id={triggerId}
      ref={ref}
      onMouseDown={handleMouseDown}
      className='absolute cursor-move select-none'
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {children}
    </div>
  );
};
