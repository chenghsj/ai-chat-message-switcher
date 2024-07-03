import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card';
import { resetToDefault, setStorageData } from '@src/config/storage';
import { initialSize, parsedInitialPosition } from '@src/config/types';
import { useContextMenu } from '@src/hooks/use-context-menu';
import { useDraggable } from '@src/hooks/use-draggable';
import { useSize } from '@src/hooks/use-size';
import { cn } from '@src/utils/cn';
import { Hand, Pin } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function SettingsMenu() {
  const { setSize } = useSize();
  const { setPosition } = useDraggable();
  const { isDraggable, setIsDraggable } = useDraggable();
  const { pinned, setPinned, setIsVisible } = useContextMenu();

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
    setPosition(parsedInitialPosition);
    setIsVisible(false);
  };

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant='link' className='h-8 w-fit px-2 py-1'>
          Settings
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className={cn(
          'z-50 mt-1 grid gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-4 text-zinc-950',
          'shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:shadow-zinc-900',
          '-translate-x-14'
        )}
      >
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
