'use client';

// Filter bar component for bike listing
// Follows DESIGN.md §8.3

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  brands: Array<{ id: string; name: string }>;
  onFilter: (filters: Record<string, string>) => void;
}

export function FilterBar({ brands, onFilter }: FilterBarProps) {
  const [selectedBrand, setSelectedBrand] = React.useState('');

  const handleFilterChange = (key: string, value: string) => {
    const filters: Record<string, string> = {};
    if (key === 'brand') setSelectedBrand(value);
    filters[key] = value;
    onFilter(filters);
  };

  return (
    <div className="bg-white rounded-lg border border-brand-secondary p-6 shadow-sm mb-6">
      <h3 className="font-bold text-brand-primary text-lg mb-4">Filter Bikes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-brand-secondary/60 mb-1">Brand</label>
          <select
            value={selectedBrand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-brand-secondary/60 mb-1">Availability</label>
          <select
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="">All statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedBrand('');
              onFilter({});
            }}
            className="px-4 py-2 rounded-md text-brand-primary hover:text-brand-accent transition-colors text-sm font-medium"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
