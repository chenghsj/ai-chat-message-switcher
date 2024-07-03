import React, { useEffect, useState } from 'react';
import { useTriggerType } from '@src/hooks/use-trigger-type';
import { ChevronDown, ChevronUp, Dot } from 'lucide-react';
import { useChatNode } from '../hooks/use-chat-node';
import { useDraggable } from '../hooks/use-draggable';
import { cn } from '../utils/cn';
import { Button } from './button';
import { Draggable } from './draggable';

export const ControlPanel: React.FC = () => {
  const { setTriggerType } = useTriggerType();
  const { clickNodeIndex, setClickNodeIndex, nodes, role } = useChatNode();
  const { isDraggable } = useDraggable();
  const [disable, setDisable] = useState({
    up: false,
    down: false,
  });

  const updateDisableState = (index: number) => {
    // Fix: the first node should disable the button
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
    <Draggable
      triggerId='grab-trigger'
      // 36 is the width of the trigger element
    >
      <div
        className={cn(
          'flex h-fit w-9 cursor-pointer flex-col items-center justify-evenly rounded-full border bg-white opacity-60 shadow-sm transition duration-200 hover:opacity-100',
          'dark:border-none dark:bg-zinc-700'
        )}
        id='context-menu-trigger'
      >
        <Button onClick={() => handleArrowClick('up')} disabled={disable.up}>
          <ChevronUp />
        </Button>
        {isDraggable && <Dot className='cursor-grab' id='grab-trigger' />}
        <Button
          onClick={() => handleArrowClick('down')}
          disabled={disable.down}
        >
          <ChevronDown />
        </Button>
      </div>
    </Draggable>
  );
};
