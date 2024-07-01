import { storage } from '@src/config/stroage';
import { useContextMenu } from '@src/hooks/use-context-menu';
import { useDraggable } from '@src/hooks/use-draggable';
import { cn } from '@src/utils/cn';

export function CheckboxGroup() {
  const { pinned, setPinned } = useContextMenu();
  const { isDraggable, setIsDraggable } = useDraggable();
  const inputClassName = cn(
    'appearance-none rounded-sm outline-none checked:text-zinc-600',
    'focus:ring-0 focus:ring-offset-0 dark:checked:border-zinc-300 dark:hover:border-zinc-300'
  );

  return (
    <div className='mr-2 flex items-center justify-end gap-3'>
      <div className='flex items-center gap-1'>
        <label htmlFor='pin-menu' className='text-sm'>
          Stay on top
        </label>
        <input
          id='pin-menu'
          className={inputClassName}
          type='checkbox'
          checked={pinned}
          onClick={() => setPinned(!pinned)}
        />
      </div>
      <div className='flex items-center gap-1'>
        <label htmlFor='panel-graggable' className='text-sm'>
          Draggable
        </label>
        <input
          id='panel-graggable'
          className={inputClassName}
          type='checkbox'
          checked={isDraggable}
          onClick={() => {
            setIsDraggable(() => {
              chrome.storage.local.set({
                [storage.GPT_PANEL_DRAGGABLE]: !isDraggable,
              });
              return !isDraggable;
            });
          }}
        />
      </div>
    </div>
  );
}
