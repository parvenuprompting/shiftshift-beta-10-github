import React from 'react';
import { Calendar, Clock, Filter } from 'lucide-react';

export function AdvancedFilters() {
  return (
    <div className="space-y-4 rounded-md border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Filter className="h-4 w-4" />
        <span>Geavanceerde Filters</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Calendar className="h-4 w-4" />
            <span>Datum bereik</span>
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Start datum"
            />
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Eind datum"
            />
          </div>
        </div>

        {/* Time Range */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock className="h-4 w-4" />
            <span>Tijd bereik</span>
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="time"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Start tijd"
            />
            <input
              type="time"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Eind tijd"
            />
          </div>
        </div>
      </div>
    </div>
  );
}