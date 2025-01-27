import { useEffect, useRef } from 'react';
import { setStorageData } from '@src/config/storage';
import { gap } from '@src/config/types';
import { useContextMenu } from '@src/hooks/use-context-menu';
import { useDraggable } from '@src/hooks/use-draggable';
import { useSearch } from '@src/hooks/use-search';
import { useSize } from '@src/hooks/use-size';
import { useDraggableLabel } from './use-draggable-label';

export const useContextMenuHandlers = (triggerId: string) => {
  const { size, isResizing } = useSize();
  const { width, height } = size;
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
  const { opacity } = useDraggableLabel();
  const menuRef = useRef<HTMLDivElement>(null);

  const getTriggerElementRect = () => {
    const triggerElement = document.getElementById(triggerId);
    return triggerElement?.getBoundingClientRect();
  };

  const handleContextMenu = async (event: MouseEvent) => {
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

      await setStorageData((data) => ({
        ...data,
        offset: { x: offsetX, y: offsetY },
      }));
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
    const controller = new AbortController();
    const { signal } = controller;

    const handleMouseEnter = () => {
      menuRef.current!.style.opacity = '1';
    };
    const handleMouseLeave = () => {
      if (isResizing) {
        menuRef.current!.style.opacity = '1';
      } else {
        menuRef.current!.style.opacity = `${opacity}`;
      }
    };
    if (isVisible && menuRef.current) {
      menuRef.current.addEventListener('mouseenter', handleMouseEnter, {
        signal,
      });
      menuRef.current.addEventListener('mouseleave', handleMouseLeave, {
        signal,
      });
    }
    return () => {
      if (menuRef.current) {
        controller.abort();
      }
    };
  }, [opacity, isVisible, isResizing]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    document.addEventListener('contextmenu', handleContextMenu, { signal });
    document.addEventListener('click', handleClick, { signal });

    return () => {
      controller.abort();
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
    if (isVisible) {
      adjustVerticalPosition();
    }
  }, [height, isVisible, isResizing]);

  return {
    menuRef,
    handlePinChange,
    handleDraggableChange,
  };
};
