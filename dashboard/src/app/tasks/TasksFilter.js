'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function TasksFilter({ currentState }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const filters = [
    { label: 'Open', value: 'open' },
    { label: 'Closed', value: 'closed' },
    { label: 'All', value: 'all' },
  ];
  
  const handleFilterChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set('state', value);
    router.push(`/tasks?${params.toString()}`);
  };
  
  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => handleFilterChange(filter.value)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentState === filter.value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
