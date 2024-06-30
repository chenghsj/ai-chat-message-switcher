import React from 'react';
import { cn } from '@src/utils/cn';

type Props = {
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, className, ...props }: Props) {
  return (
    <button
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        'aspect-square w-full scale-90 appearance-none rounded-full',
        'flex items-center justify-center',
        'hover:border hover:shadow-sm',
        'p-1 focus:outline-none active:bg-gray-200',
        'transition duration-150 ease-in-out',
        'dark:border-none dark:hover:bg-zinc-800 dark:active:bg-zinc-900',
        'disabled:opacity-50 disabled:shadow-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
