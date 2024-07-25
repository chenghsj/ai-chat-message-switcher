import React, { useEffect, useState } from 'react';
import { triggerId } from '@src/config/types';
import { userTriggerType } from '@src/hooks/use-trigger-type';
import { ChevronDown, ChevronUp, Dot } from 'lucide-react';
import { useChatNode } from '../hooks/use-chat-node';
import { useDraggable } from '../hooks/use-draggable';
import { cn } from '../utils/cn';
import { Draggable } from './draggable';
import { Button } from './ui/button';

export const ControlPanel: React.FC = () => {
  const { setTriggerType } = userTriggerType();
  const { clickNodeIndex, setClickNodeIndex, nodes, role } = useChatNode();
  const { isDraggable } = useDraggable();
  const [disable, setDisable] = useState({
    up: false,
    down: false,
  });

  const updateDisableState = (index: number) => {
    setDisable({
      up: index === -1,
      down: index === nodes.length - 1,
    });
  };

  const handleArrowClick = (direction: 'up' | 'down') => {
    if (nodes.length === 1 && direction === 'up') {
      nodes[0].scrollIntoView({ behavior: 'auto', block: 'center' });
      return;
    }
    const currentIndex = clickNodeIndex ?? 0;
    let newIndex = currentIndex;
    const isUp = direction === 'up';
    const isDown = direction === 'down';

    if (isUp) {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (isDown) {
      newIndex = Math.min(nodes.length - 1, currentIndex + 1);
    }
    setClickNodeIndex(newIndex);
    setTriggerType('panel-click');
    nodes[newIndex].scrollIntoView({
      behavior: 'auto',
      block: role === 'user' ? 'center' : 'start',
    });
    updateDisableState(newIndex);
  };

  useEffect(() => {
    updateDisableState(clickNodeIndex ?? 0);
  }, [clickNodeIndex]);

  return (
    <Draggable triggerId={triggerId.grabContextMenu}>
      <div
        className={cn(
          'flex h-fit w-9 cursor-pointer flex-col items-center justify-evenly rounded-full border bg-white opacity-60 shadow-sm transition duration-200 hover:opacity-100',
          'dark:border-none dark:bg-zinc-700'
        )}
        id={triggerId.openContextMenu}
      >
        <Button
          className={cn(
            clickNodeIndex === 0 &&
              'border-none opacity-40 dark:hover:bg-transparent'
          )}
          variant='panel'
          size='none'
          onClick={() => handleArrowClick('up')}
          disabled={disable.up}
        >
          <ChevronUp className='dark:text-white' />
        </Button>
        {isDraggable && (
          <Dot
            className='cursor-grab dark:text-white'
            id={triggerId.grabContextMenu}
          />
        )}
        <Button
          variant='panel'
          size='none'
          onClick={() => handleArrowClick('down')}
          disabled={disable.down}
        >
          <ChevronDown className='dark:text-white' />
        </Button>
      </div>
    </Draggable>
  );
};
