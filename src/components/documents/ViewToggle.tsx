import React from 'react';
import { Grid, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-md shadow-sm">
      <button
        onClick={() => onViewChange('grid')}
        className={`rounded-l-md border p-2 ${
          view === 'grid'
            ? 'border-blue-500 bg-blue-50 text-blue-600'
            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
        }`}
        title="Grid weergave"
      >
        <Grid className="h-5 w-5" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`rounded-r-md border-b border-r border-t p-2 ${
          view === 'list'
            ? 'border-blue-500 bg-blue-50 text-blue-600'
            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
        }`}
        title="Lijst weergave"
      >
        <List className="h-5 w-5" />
      </button>
    </div>
  );
}