import React, { ReactNode, useEffect, useRef } from 'react';
import { useChatNode } from '@src/hooks/use-chat-node';
import { useSize } from '@src/hooks/use-size';
import { capitalize } from '@src/utils/capitalize';
import { cn } from '@src/utils/cn';
import { useContextMenu } from '../hooks/use-context-menu';
import { useDraggable } from '../hooks/use-draggable';
import { useSearch } from '../hooks/use-search';
import { CheckboxGroup } from './check-box-group';
import { SearchBox } from './search-box';
import { SettingsMenu } from './settings-menu';
import { useDropdown } from '@src/hooks/use-dropdown';

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
  const {open: dropdownIsOpen} = useDropdown();
  const { setSearchTerm } = useSearch();
  const { position: draggedPosition } = useDraggable();
  const { setIsExpanded, nodes: roleNodes } = useChatNode();
  const menuRef = useRef<HTMLDivElement>(null);
  const gap = 5;

  const getTriggerElementRect = () => {
    const triggerElement = document.getElementById(triggerId);
    return triggerElement?.getBoundingClientRect();
  };

  const handleContextMenu = (event: MouseEvent) => {
    if (pinned) return;

    const rect = getTriggerElementRect();
    const target = event.target as Node;
    if (
      rect &&
      (target === document.getElementById(triggerId) ||
        document.getElementById(triggerId)?.contains(target))
    ) {
      event.preventDefault();
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      let adjustedX = rect.right + gap;
      let adjustedY = rect.top - height / 2 + rect.height / 2;

      if (adjustedX + width > screenWidth) {
        adjustedX = rect.left - width - gap;
        setControlPanelSide('right');
      } else {
        setControlPanelSide('left');
      }

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
    if (pinned || isResizing || dropdownIsOpen) return;

    const rect = getTriggerElementRect();
    const target = event.target as Node;
    if (
      rect &&
      (target === document.getElementById(triggerId) ||
        document.getElementById(triggerId)?.contains(target))
    ) {
      return;
    }
    if (menuRef.current && !menuRef.current.contains(target)) {
      setIsVisible(false);
      setSearchTerm('');
    }
  };

  const adjustPositionWithinBounds = (x: number, y: number) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const rect = getTriggerElementRect();
    if (!rect) return { x, y };

    let adjustedX = x;
    let adjustedY = rect.top - height / 2 + rect.height / 2;

    if (adjustedX + width > screenWidth) {
      adjustedX = rect.left - width - gap;
      setControlPanelSide('right');
    } else if (adjustedX < gap) {
      adjustedX = rect.right + gap;
      setControlPanelSide('left');
      if (adjustedX + width > screenWidth) {
        adjustedX = x;
      }
    } else {
      setControlPanelSide(adjustedX > rect.left ? 'left' : 'right');
    }

    if (adjustedY + height > screenHeight) {
      adjustedY = screenHeight - height - gap;
    } else if (adjustedY < gap) {
      adjustedY = gap;
    }

    return { x: adjustedX, y: adjustedY };
  };

  const adjustVerticalPosition = () => {
    if (isVisible) {
      const screenHeight = window.innerHeight;
      const rect = getTriggerElementRect();
      if (rect) {
        let adjustedY = rect.top - height / 2 + rect.height / 2;
        if (adjustedY + height > screenHeight) {
          adjustedY = screenHeight - height - gap;
        }
        if (adjustedY < gap) {
          adjustedY = gap;
        }
        setPosition((prevPosition) => ({ ...prevPosition, y: adjustedY }));
      }
    }
  };

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, [draggedPosition, pinned, isResizing, isVisible]);

  useEffect(() => {
    if (isVisible && !isResizing) {
      const newX = draggedPosition.x + offset.x;
      const newY = draggedPosition.y + offset.y;
      const adjustedPosition = adjustPositionWithinBounds(newX, newY);
      setPosition(adjustedPosition);
    }
  }, [draggedPosition, isVisible, offset.x, offset.y]);

  useEffect(() => {
    if (isVisible && !isResizing) {
      adjustVerticalPosition();
    }
  }, [height, isVisible, isResizing]);

  return (
    <div
      ref={menuRef}
      className={cn(
        'absolute z-50 transition-opacity duration-200',
        'flex flex-col gap-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm',
        'dark:border-none dark:bg-zinc-700 dark:shadow-md dark:shadow-zinc-800',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      style={{ top: 0, left: 0, width: `${width}px`, height: `${height}px` }}
      onClick={() =>
        !isResizing && setIsExpanded(new Array(roleNodes.length).fill(false))
      }
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
        {/* <button
          onClick={() => {
            chrome.storage.sync.clear(function () {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
              } else {
                console.log('chrome.storage.sync data cleared.');
              }
            });
          }}
        >
          Clear
        </button> */}
        <CheckboxGroup />
      </div>
        <SettingsMenu />
      <SearchBox />
      {children}
    </div>
  );
};
