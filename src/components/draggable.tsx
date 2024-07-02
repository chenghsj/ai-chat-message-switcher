import React, { useRef } from 'react';
import { setStorageData } from '@src/config/storage';
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
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (
    event: MouseEvent,
    initialMouseX: number,
    initialMouseY: number,
    initialElementX: number,
    initialElementY: number
  ) => {
    const deltaX = event.clientX - initialMouseX;
    const deltaY = event.clientY - initialMouseY;

    // Calculate new position
    let newX = initialElementX + deltaX;
    let newY = initialElementY + deltaY;

    // Get the dimensions of the draggable element
    const elementWidth = ref.current?.offsetWidth || 0;
    const elementHeight = ref.current?.offsetHeight || 0;

    // Boundary checks with 5px margin
    const margin = 5;
    newX = Math.max(
      margin,
      Math.min(newX, window.innerWidth - elementWidth - margin)
    );
    newY = Math.max(
      margin,
      Math.min(newY, window.innerHeight - elementHeight - margin)
    );

    setPosition({
      x: newX,
      y: newY,
    });
  };

  const handleMouseUp = async (
    event: MouseEvent,
    initialMouseX: number,
    initialMouseY: number,
    initialElementX: number,
    initialElementY: number
  ) => {
    // Ensure to capture the final mouse position
    const deltaX = event.clientX - initialMouseX;
    const deltaY = event.clientY - initialMouseY;

    const newX = initialElementX + deltaX;
    const newY = initialElementY + deltaY;

    document.removeEventListener('mousemove', boundMouseMove);
    document.removeEventListener('mouseup', boundMouseUp);

    await setStorageData((data) => ({
      ...data,
      draggedPosition: { x: newX, y: newY },
    }));
  };

  let boundMouseMove: (event: MouseEvent) => void;
  let boundMouseUp: (event: MouseEvent) => void;

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!isDraggable) return;

    const initialMouseX = event.clientX;
    const initialMouseY = event.clientY;
    const initialElementX = position.x;
    const initialElementY = position.y;

    boundMouseMove = (moveEvent) =>
      handleMouseMove(
        moveEvent,
        initialMouseX,
        initialMouseY,
        initialElementX,
        initialElementY
      );

    boundMouseUp = (moveEvent) =>
      handleMouseUp(
        moveEvent,
        initialMouseX,
        initialMouseY,
        initialElementX,
        initialElementY
      );

    document.addEventListener('mousemove', boundMouseMove);
    document.addEventListener('mouseup', boundMouseUp);
  };

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
