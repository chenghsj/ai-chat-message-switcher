import { setStorageData } from '@src/config/storage';
import { useContextMenu } from '@src/hooks/use-context-menu';
import { useDraggable } from '@src/hooks/use-draggable';
import { cn } from '@src/utils/cn';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function CheckboxGroup() {
  const { pinned, setPinned } = useContextMenu();
  const {
    isDraggable,
    setIsDraggable,
  } = useDraggable();
  const inputClassName = cn(
    'appearance-none rounded-sm outline-none checked:text-zinc-600',
    'focus:ring-0 focus:ring-offset-0 dark:checked:border-zinc-300 dark:hover:border-zinc-300'
  );

  return (
    <div className='mr-2 flex flex-wrap items-center justify-end gap-x-2 gap-y-1'>
        <div className="flex items-center space-x-2">
          <Label htmlFor="pin-menu">Stay on top</Label>
          <Switch id="pin-menu" 
          onClick={async () => {
            await setStorageData((data) => ({
              ...data,
              pinned: !pinned,
            }));
            setPinned(!pinned);
          }}/>
        </div>
      {/* <div className='flex items-center gap-1'>
        <label htmlFor='pin-menu' className='text-xs'>
          Stay on top
        </label>
        <input
          id='pin-menu'
          className={inputClassName}
          type='checkbox'
          checked={pinned}
          onClick={async () => {
            await setStorageData((data) => ({
              ...data,
              pinned: !pinned,
            }));
            setPinned(!pinned);
          }}
        />
      </div> */}
      <div className='flex items-center gap-1'>
        <label htmlFor='panel-graggable' className='text-xs'>
          Draggable
        </label>
        <input
          id='panel-graggable'
          className={inputClassName}
          type='checkbox'
          checked={isDraggable}
          onClick={async () => {
            await setStorageData((data) => ({
              ...data,
              draggable: !isDraggable,
            }));
            setIsDraggable(!isDraggable);
          }}
        />
      </div>
    </div>
  );
}
