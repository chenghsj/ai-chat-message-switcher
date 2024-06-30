import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useContextMenu } from '@src/hooks/use-context-menu';
import { useTriggerType } from '@src/hooks/use-trigger-type';
import { cn } from '@src/utils/cn';
import { findClosestDivIndex } from '@src/utils/find-closest-div-index';
import { findClosestScrollableElement } from '@src/utils/find-closest-scrollable-element';
import { throttle } from '@src/utils/throttle';
import { ChevronDown } from 'lucide-react';
import { ChatNodeRoleType, useChatNode } from '../hooks/use-chat-node';
import { useSearch } from '../hooks/use-search';

interface ChatNodeProps {
  role?: ChatNodeRoleType;
}

export const ChatNodeList: React.FC<ChatNodeProps> = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const { isVisible: isContextMenuVisible } = useContextMenu();
  const { triggerType, setTriggerType } = useTriggerType();
  const [isExpanded, setIsExpanded] = useState<boolean[]>([]);
  const { searchTerm } = useSearch();
  const {
    clickNodeIndex,
    setClickNodeIndex,
    nodes: roleNodes,
    role,
  } = useChatNode();
  let parentElement = useMemo(
    () => findClosestScrollableElement(roleNodes[0]),
    [roleNodes]
  );
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filterNodes = useMemo(
    () =>
      roleNodes.filter((node) =>
        node.textContent?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [roleNodes, searchTerm]
  );

  const scrollToNode = (
    node: HTMLElement,
    index: number,
    block: ScrollLogicalPosition
  ) => {
    node?.scrollIntoView({ behavior: 'auto', block });
    setClickNodeIndex(index); // Update the state to mark this node as clicked
  };

  const handleExpandClick =
    (index: number) => (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setIsExpanded((prev) =>
        prev.map((_, i) => (i === index ? !prev[i] : false))
      );
    };

  useEffect(() => {
    if (!isContextMenuVisible) {
      setIsExpanded(new Array(roleNodes.length).fill(false));
    }
  }, [isContextMenuVisible]);

  useEffect(() => {
    setIsExpanded(new Array(roleNodes.length).fill(false));
  }, [role]);

  useEffect(() => {
    itemRefs.current[clickNodeIndex as number]?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
    });
  }, [clickNodeIndex]);

  useEffect(() => {
    setClickNodeIndex(roleNodes.length > 1 ? roleNodes.length - 1 : 0);
    setIsExpanded(new Array(roleNodes.length).fill(false));
  }, [roleNodes.length]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (triggerType === 'window-scroll') {
        setClickNodeIndex(findClosestDivIndex(roleNodes));
      }
      setTriggerType('window-scroll');
    }, 200);

    parentElement?.addEventListener('scroll', handleScroll);

    return () => {
      parentElement?.removeEventListener('scroll', handleScroll);
    };
  }, [parentElement, roleNodes]);

  return (
    <div
      ref={listRef}
      className={cn(
        'grid h-fit grid-cols-1 flex-col gap-2 overflow-y-auto pr-2'
      )}
    >
      {filterNodes.map((node, index) => (
        <div
          data-message-id={node.dataset.messageId}
          key={index}
          ref={(el) => (itemRefs.current[index] = el)}
          className={cn(
            'cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all duration-200',
            'grid grid-flow-col grid-cols-12',
            isExpanded[index] ? 'h-28' : 'h-10',
            {
              'bg-gray-200 dark:bg-zinc-800': clickNodeIndex === index,
            }
          )}
        >
          <div
            className='relative col-span-11 flex justify-between overflow-y-auto py-2 pl-3'
            onClick={() => {
              setTriggerType('context-menu-click');
              scrollToNode(node, index, role === 'user' ? 'center' : 'start');
            }}
          >
            <div
              className={cn(
                'text-ellipsis whitespace-nowrap pr-1 text-sm transition',
                isExpanded[index]
                  ? 'overflow-y-auto whitespace-pre-wrap'
                  : 'overflow-hidden whitespace-nowrap'
              )}
              title={node.textContent || ''}
            >
              {node.textContent ? node.textContent : ''}
            </div>
            <div className='sticky border-r border-zinc-400' />
          </div>

          <div
            // TODO: Check if the text is ellipsed to disable the expand button
            className={cn(
              `z-20 col-span-1 h-10 w-full origin-center transform select-none transition duration-200`,
              'flex items-center justify-center',
              isExpanded[index] ? 'rotate-180' : ''
            )}
            onClick={handleExpandClick(index)}
          >
            <ChevronDown className='scale-90' />

            {isExpanded[index] && (
              <div
                className='absolute bottom-0 h-28 w-full'
                onClick={handleExpandClick(index)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
