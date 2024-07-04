import React from 'react';
import { Search } from 'lucide-react';
import { useSearchContext } from '../hooks/use-search-context';

type Props = {};

export function SearchBox({}: Props) {
  const { searchTerm, setSearchTerm } = useSearchContext();

  return (
    <div className='mr-2 flex h-10 items-center rounded-lg border p-1 pr-4 focus-within:bg-gray-100 dark:text-zinc-50 dark:focus-within:bg-zinc-900'>
      <Search className='ml-2 scale-95' />
      <input
        type='text'
        placeholder='Search...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='ml-2 flex-grow appearance-none border-none bg-transparent p-1 outline-none focus:ring-0 focus:ring-offset-0'
      />
    </div>
  );
}
