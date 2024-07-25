import React, { ReactNode } from 'react';
import { contextMenuId, triggerId } from '@src/config/types';
import { useChatNode } from '@src/hooks/use-chat-node';
import { useContextMenu } from '@src/hooks/use-context-menu';
import { useContextMenuHandlers } from '@src/hooks/use-context-menu-handlers';
import { useDraggable } from '@src/hooks/use-draggable';
import { useDraggableLabel } from '@src/hooks/use-draggable-label';
import { useSearch } from '@src/hooks/use-search';
import { useSize } from '@src/hooks/use-size';
import { capitalize } from '@src/utils/capitalize';
import { cn } from '@src/utils/cn';
import { Bot, Hand, Pin, User } from 'lucide-react';
import { SearchBox } from './search-box';
import { SettingsMenu } from './settings-menu';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

type ContextMenuProps = {
  children?: ReactNode;
};

export const ContextMenu: React.FC<ContextMenuProps> = ({ children }) => {
  const {
    size: { width, height },
    isResizing,
  } = useSize();
  const { opacity } = useDraggableLabel();
  const { role, setRole, setIsExpanded, nodes: roleNodes } = useChatNode();
  const { isDraggable } = useDraggable();
  const { isVisible, pinned } = useContextMenu();
  const { setSearchTerm } = useSearch();
  const { menuRef, handlePinChange, handleDraggableChange } =
    useContextMenuHandlers(triggerId.openContextMenu);

  return (
    <div
      id={contextMenuId}
      ref={menuRef}
      className={cn(
        'absolute z-30 transition-opacity duration-200',
        'flex flex-col gap-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm',
        'overflow-hidden dark:border-none dark:bg-zinc-700 dark:shadow-md dark:shadow-zinc-800',
        isVisible ? `visible` : 'pointer-events-none invisible'
      )}
      style={{
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        opacity,
      }}
      onClick={() =>
        !isResizing && setIsExpanded(new Array(roleNodes.length).fill(false))
      }
    >
      <div className='flex min-h-[34px] items-center justify-between overflow-x-auto'>
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
            {role === 'user' ? (
              <User className='dark:text-white' />
            ) : (
              <Bot className='dark:text-white' />
            )}
          </div>

          <div className='dark:text-white'>{capitalize(role)}</div>
        </Button>
        {isResizing ? (
          <Badge variant='outline'>
            {Math.floor(width)}x{Math.floor(height)}
          </Badge>
        ) : (
          <div className='flex items-center'>
            <div className='flex w-14 scale-[0.65] justify-end gap-1'>
              <div
                title='Stay on top'
                className={cn(!pinned && 'opacity-25', 'cursor-pointer')}
                onClick={handlePinChange}
              >
                <Pin className='dark:text-white' />
              </div>
              <div
                title='Draggable'
                className={cn(!isDraggable && 'opacity-25', 'cursor-pointer')}
                onClick={handleDraggableChange}
              >
                <Hand className='dark:text-white' />
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
