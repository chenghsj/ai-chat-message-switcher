import React, { ReactNode } from 'react';
import { Separator } from '@radix-ui/react-separator';
import { triggerId } from '@src/config/types';
import { useChatNode } from '@src/hooks/use-chat-node';
import { useContextMenuContext } from '@src/hooks/use-context-menu-context';
import { useContextMenuHandlers } from '@src/hooks/use-context-menu-handlers';
import { useDraggableContext } from '@src/hooks/use-draggable-context';
import { useSearchContext } from '@src/hooks/use-search-context';
import { useSizeContext } from '@src/hooks/use-size-context';
import { capitalize } from '@src/utils/capitalize';
import { cn } from '@src/utils/cn';
import { Bot, Hand, Pin, User } from 'lucide-react';
import { SearchBox } from './search-box';
import { SettingsMenu } from './settings-menu';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type ContextMenuProps = {
  children?: ReactNode;
};

export const ContextMenu: React.FC<ContextMenuProps> = ({ children }) => {
  const {
    size: { width, height },
    isResizing,
  } = useSizeContext();
  const { role, setRole, setIsExpanded, nodes: roleNodes } = useChatNode();
  const { isDraggable } = useDraggableContext();
  const { isVisible, pinned } = useContextMenuContext();
  const { setSearchTerm } = useSearchContext();
  const { menuRef, handlePinChange, handleDraggableChange } =
    useContextMenuHandlers(triggerId.openContextMenu);

  return (
    <div
      ref={menuRef}
      className={cn(
        'absolute z-30 transition-opacity duration-200',
        'flex flex-col gap-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm',
        'overflow-hidden dark:border-none dark:bg-zinc-700 dark:shadow-md dark:shadow-zinc-800',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      style={{ top: 0, left: 0, width: `${width}px`, height: `${height}px` }}
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
            {role === 'user' ? <User /> : <Bot />}
          </div>

          {capitalize(role)}
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
