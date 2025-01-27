import { resetStorageData, setStorageData } from '@src/config/storage';
import {
  initialContextMenuPosition,
  initialOpacity,
  initialSize,
  parsedInitialControlPanelPosition,
} from '@src/config/types';
import { useContextMenu } from '@src/hooks/use-context-menu';
import { useDraggable } from '@src/hooks/use-draggable';
import {
  max,
  min,
  step,
  useDraggableLabel,
} from '@src/hooks/use-draggable-label';
import { useSize } from '@src/hooks/use-size';
import { cn } from '@src/utils/cn';
import { Droplet, Hand, Pin } from 'lucide-react';
import { Button } from './ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function SettingsMenu() {
  const { setSize } = useSize();
  const { isDraggable, setIsDraggable, setPosition } = useDraggable();
  const {
    pinned,
    setPinned,
    setIsVisible,
    setPosition: setContextMenuPosition,
  } = useContextMenu();
  const {
    opacity,
    setOpacity,
    handleInputChange: handleOpacityChange,
    handleMouseDown: handleLabelMouseDown,
  } = useDraggableLabel();

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
    await resetStorageData();

    setIsDraggable(true);
    setPinned(false);
    setSize(initialSize);
    setPosition(parsedInitialControlPanelPosition);
    setIsVisible(false);
    setContextMenuPosition(initialContextMenuPosition);
    setOpacity(initialOpacity);
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
        <div className='flex items-center justify-between gap-3'>
          <div className='flex'>
            <Droplet className='mr-2 h-4 w-4' />
            <Label
              onMouseDown={handleLabelMouseDown}
              className='cursor-ew-resize select-none'
            >
              Opacity
            </Label>
          </div>
          <Input
            type='number'
            value={opacity}
            onChange={handleOpacityChange}
            className='h-fit w-fit p-1 text-center'
            step={step}
            min={min}
            max={max}
          />
        </div>
        <Button className='w-full' size='sm' onClick={handleReset}>
          Reset
        </Button>
      </HoverCardContent>
    </HoverCard>
  );
}
