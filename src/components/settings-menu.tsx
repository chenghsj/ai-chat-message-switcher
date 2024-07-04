import { resetToDefault, setStorageData } from '@src/config/storage';
import {
  initialContextMenuPosition,
  initialSize,
  parsedInitialControlPanelPosition,
} from '@src/config/types';
import { useContextMenuContext } from '@src/hooks/use-context-menu-context';
import { useDraggableContext } from '@src/hooks/use-draggable-context';
import { useSizeContext } from '@src/hooks/use-size-context';
import { cn } from '@src/utils/cn';
import { Hand, Pin } from 'lucide-react';
import { Button } from './ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function SettingsMenu() {
  const { setSize } = useSizeContext();
  const { isDraggable, setIsDraggable, setPosition } = useDraggableContext();
  const {
    pinned,
    setPinned,
    setIsVisible,
    setPosition: setContextMenuPosition,
  } = useContextMenuContext();

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

  const handleReset = async () => {
    await resetToDefault();

    setIsDraggable(true);
    setPinned(false);
    setSize(initialSize);
    setPosition(parsedInitialControlPanelPosition);
    setIsVisible(false);
    setContextMenuPosition(initialContextMenuPosition);
  };

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant='link' className='h-8 w-fit px-2 py-1'>
          Settings
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className={cn('grid w-fit gap-3')}>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex'>
            <Pin className='mr-2 h-4 w-4' />
            <Label htmlFor='pin-menu'>Stay on top</Label>
          </div>
          <Switch
            className='scale-75'
            checked={pinned}
            id='pin-menu'
            onClick={handlePinChange}
          />
        </div>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex'>
            <Hand className='mr-2 h-4 w-4' />
            <Label htmlFor='panel-graggable'>Draggable</Label>
          </div>
          <Switch
            className='scale-75'
            checked={isDraggable}
            id='panel-graggable'
            onClick={handleDraggableChange}
          />
        </div>
        <Button className='w-full' size='sm' onClick={handleReset}>
          Reset
        </Button>
      </HoverCardContent>
    </HoverCard>
  );
}
