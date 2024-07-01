import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useChatNode } from '@src/hooks/use-chat-node';
import { useSize } from '@src/hooks/use-size';
import { capitalize } from '@src/utils/captilize';
import { cn } from '@src/utils/cn';
import { useContextMenu } from '../hooks/use-context-menu';
import { useDraggable } from '../hooks/use-draggable';
import { useSearch } from '../hooks/use-search';
import { CheckboxGroup } from './check-box-group';
import { SearchBox } from './search-box';

type ContextMenuProps = {
  children?: ReactNode;
  triggerId: string; // ID of the element that triggers the context menu
};
export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  triggerId,
}) => {
  const { size, isResizing } = useSize();
  const { width, height } = size;
  const { role, setRole } = useChatNode();
  const {
    isVisible,
    setIsVisible,
    setPosition,
    setControlPanelSide,
    offset,
    setOffset,
    pinned,
  } = useContextMenu();
  const { setSearchTerm } = useSearch();
  const { position: draggedPosition } = useDraggable();
  const menuRef = useRef<HTMLDivElement>(null);
  const gap = 5;
  const handleContextMenu = (event: MouseEvent) => {
    if (pinned) return;
    const triggerElement = document.getElementById(triggerId);
    if (
      triggerElement &&
      (event.target === triggerElement ||
        triggerElement.contains(event.target as Node))
    ) {
      event.preventDefault();
      const rect = triggerElement.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      let adjustedX = rect.right + gap;
      let adjustedY = rect.top;
      setControlPanelSide('left');
      // Adjust initial position for X
      if (adjustedX + width > screenWidth) {
        setControlPanelSide('right');
        adjustedX = rect.left - width - gap; // Move to the left side of the trigger element
      }
      // Adjust initial position for Y
      if (adjustedY + height > screenHeight) {
        adjustedY = screenHeight - height - gap;
      }
      if (adjustedY < gap) {
        adjustedY = gap;
      }
      const offsetX = adjustedX - draggedPosition.x;
      const offsetY = adjustedY - draggedPosition.y;
      setOffset({ x: offsetX, y: offsetY });
      setPosition({ x: adjustedX, y: adjustedY });
      setIsVisible(true);
    }
  };
  const handleClick = (event: MouseEvent) => {
    if (pinned || isResizing) return;
    const triggerElement = document.getElementById(triggerId);
    if (
      triggerElement &&
      (event.target === triggerElement ||
        triggerElement.contains(event.target as Node))
    ) {
      return;
    }
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsVisible(false);
      setSearchTerm('');
    }
  };
  const adjustPositionWithinBounds = (x: number, y: number) => {
    console.log('adjust');
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const triggerElement = document.getElementById(triggerId);
    if (!triggerElement) {
      return { x, y };
    }
    const rect = triggerElement.getBoundingClientRect();
    let adjustedX = x;
    let adjustedY = y;
    // Adjust X position
    setControlPanelSide('right');
    // TODO: fix the exceed issue
    if (adjustedX + width > screenWidth) {
      adjustedX = rect.left - width - gap; // Move to the left side of the trigger element
    } else if (adjustedX < gap) {
      setControlPanelSide('left');
      adjustedX = rect.right + gap; // Move to the right side of the trigger element
    }
    // Adjust Y position
    if (adjustedY + height > screenHeight) {
      adjustedY = screenHeight - height - gap;
    } else if (adjustedY < gap) {
      adjustedY = gap;
    }
    return { x: adjustedX, y: adjustedY };
  };

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, [draggedPosition, pinned, isResizing]);

  useEffect(() => {
    if (isVisible) {
      let newX = draggedPosition.x + offset.x;
      let newY = draggedPosition.y + offset.y;
      const adjustedPosition = adjustPositionWithinBounds(newX, newY);
      setPosition(adjustedPosition);
    }
  }, [draggedPosition, isVisible]);

  return (
    <div
      ref={menuRef}
      className={cn(
        'absolute z-50 transition-opacity duration-200',
        'flex flex-col gap-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm',
        'dark:border-none dark:bg-zinc-700 dark:shadow-md dark:shadow-zinc-800',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      style={{
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className='flex justify-between'>
        <button
          className={cn(
            'w-24 rounded-md border px-1 py-1 text-sm shadow-sm transition duration-200',
            'hover:bg-zinc-100 active:bg-zinc-200',
            'dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:active:bg-zinc-900'
          )}
          onClick={() => {
            setSearchTerm('');
            setRole((prev) => (prev === 'user' ? 'assistant' : 'user'));
          }}
        >
          {capitalize(role)}
        </button>
        <CheckboxGroup />
      </div>
      <SearchBox />
      {children}
    </div>
  );
};
