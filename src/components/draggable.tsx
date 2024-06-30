import React, { useEffect, useRef } from 'react';
import { useDraggable } from '../hooks/use-draggable';

interface Position {
  x: string | number;
  y: string | number;
}

interface DraggableProps {
  initialPosition: Position;
  triggerId: string;
  children: React.ReactNode;
}

const parsePosition = (pos: string | number, axis: 'x' | 'y'): number => {
  if (typeof pos === 'number') {
    return pos;
  }

  const percentageMatch = pos.match(/([0-9]+)%/);
  const offsetMatch = pos.match(/([-+]?[0-9]+)px$/);
  const operatorMatch = pos.match(/([-+])/);

  if (percentageMatch) {
    const percentage = parseFloat(percentageMatch[1]);
    const offset = offsetMatch ? parseFloat(offsetMatch[1]) : 0;
    const operator = operatorMatch ? operatorMatch[0] : '+';
    const parentSize = axis === 'x' ? window.innerWidth : window.innerHeight;

    return operator === '+'
      ? (parentSize * percentage) / 100 + offset
      : (parentSize * percentage) / 100 - offset;
  } else {
    return parseFloat(pos);
  }
};

export const Draggable: React.FC<DraggableProps> = ({
  initialPosition,
  triggerId,
  children,
}) => {
  const { position, setPosition, isDraggable } = useDraggable();

  const initialX = parsePosition(initialPosition.x, 'x');
  const initialY = parsePosition(initialPosition.y, 'y');

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition({
      x: initialX,
      y: initialY,
    });
  }, [initialX, initialY, setPosition]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!isDraggable) return;

    const initialMouseX = event.clientX;
    const initialMouseY = event.clientY;
    const initialElementX = position.x;
    const initialElementY = position.y;
    let isDragging = false;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      isDragging = true;
      const deltaX = moveEvent.clientX - initialMouseX;
      const deltaY = moveEvent.clientY - initialMouseY;

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

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
