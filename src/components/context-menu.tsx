import React, { ReactNode, useEffect, useRef } from 'react';
import { Separator } from '@radix-ui/react-separator';
import { setStorageData } from '@src/config/storage';
import { Position, gap } from '@src/config/types';
import { useChatNode } from '@src/hooks/use-chat-node';
import { useSize } from '@src/hooks/use-size';
import { capitalize } from '@src/utils/capitalize';
import { cn } from '@src/utils/cn';
import { Bot, Hand, Pin, User } from 'lucide-react';
import { useContextMenu } from '../hooks/use-context-menu';
import { useDraggable } from '../hooks/use-draggable';
import { useSearch } from '../hooks/use-search';
import { SearchBox } from './search-box';
import { SettingsMenu } from './settings-menu';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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
    setPinned,
  } = useContextMenu();
  const { setSearchTerm } = useSearch();
  const {
    position: draggedPosition,
    isDraggable,
    setIsDraggable,
  } = useDraggable();
  const { setIsExpanded, nodes: roleNodes } = useChatNode();
  const menuRef = useRef<HTMLDivElement>(null);

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

      const offsetX = adjustedX - (draggedPosition as Position).x;
      const offsetY = adjustedY - (draggedPosition as Position).y;
      setOffset({ x: offsetX, y: offsetY });
      setPosition({ x: adjustedX, y: adjustedY });
      setIsVisible(true);
    }
  };

  const handleClick = (event: MouseEvent) => {
    if (pinned || isResizing) return;

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

  const handlePinChange = async () => {
    await setStorageData((data) => ({
      ...data,
      pinned: !pinned,
    }));
    setPinned(!pinned);
  };

  const handleDraggableChange = async () => {
    await setStorageData((data) => ({
      ...data,
      draggable: !isDraggable,
    }));
    setIsDraggable(!isDraggable);
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
      const newX = (draggedPosition as Position).x + offset.x;
      const newY = (draggedPosition as Position).y + offset.y;
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
        'absolute z-30 transition-opacity duration-200',
        'flex flex-col gap-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm',
        'dark:border-none dark:bg-zinc-700 dark:shadow-md dark:shadow-zinc-800',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      style={{ top: 0, left: 0, width: `${width}px`, height: `${height}px` }}
      onClick={() =>
        !isResizing && setIsExpanded(new Array(roleNodes.length).fill(false))
      }
    >
      <div className='flex items-center justify-between overflow-x-auto'>
        <Button
          variant='outline'
          className='w-28 rounded-lg py-1 pr-2 dark:border-zinc-500 dark:bg-zinc-700'
          size='none'
          onClick={() => {
            setSearchTerm('');
            setRole((prev) => (prev === 'user' ? 'assistant' : 'user'));
          }}
        >
          <div className='scale-[0.65]'>
            {role === 'user' ? <User /> : <Bot />}
          </div>

          {capitalize(role)}
        </Button>
        {isResizing ? (
          <Badge variant='outline'>
            {Math.floor(size.width)}x{Math.floor(size.height)}
          </Badge>
        ) : (
          <div className='flex items-center'>
            <div className='flex w-14 scale-[0.65] justify-end gap-1'>
              <div
                title='Stay on top'
                className={cn(!pinned && 'opacity-25', 'cursor-pointer')}
                onClick={handlePinChange}
              >
                <Pin />
              </div>
              <div
                title='Draggable'
                className={cn(!isDraggable && 'opacity-25', 'cursor-pointer')}
                onClick={handleDraggableChange}
              >
                <Hand />
              </div>
            </div>
            <Separator
              orientation='vertical'
              className='h-4 w-[1px] bg-zinc-400 dark:bg-zinc-300'
            />
            <SettingsMenu />
          </div>
        )}
      </div>
      <SearchBox />
      {children}
    </div>
  );
};
