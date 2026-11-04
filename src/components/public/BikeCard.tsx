'use client';

// Bike card component for public catalogue
// Follows DESIGN.md §8.3 - no fake data, all data from API

import * as React from 'react';
import { cn } from '@/lib/utils';
import { formatInr } from '@/lib/currency';
import { StatusChip } from '@/components/ui/status-chip';

interface BikeCardProps {
  id: string;
  brand: string;
  model: string;
  variant: string;
  colour: string;
  exShowroomPrice: number;
  onRoadPrice: number;
  availabilityStatus: string;
  imageUrl?: string | undefined;
  specifications?: Record<string, string | number>;
}

export function BikeCard({
  id,
  brand,
  model,
  variant,
  colour,
  exShowroomPrice,
  onRoadPrice,
  availabilityStatus,
  imageUrl,
  specifications,
}: BikeCardProps) {
  return (
    <article
      className={cn(
        'border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow group',
        availabilityStatus === 'sold' && 'opacity-60 grayscale'
      )}
    >
      <div className="relative h-64 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${brand} ${model} ${variant}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-secondary/20 to-brand-primary/20 flex items-center justify-center">
            <svg
              className="w-24 h-24 text-brand-secondary/30"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        )}
        {availabilityStatus === 'sold' && (
          <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SOLD</span>
          </div>
        )}
        {availabilityStatus === 'reserved' && (
          <div className="absolute inset-0 bg-amber-500/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">RESERVED</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-brand-secondary/10 text-xs font-medium text-brand-secondary rounded">
            {availabilityStatus.charAt(0).toUpperCase() + availabilityStatus.slice(1)}
          </span>
        </div>
        <h3 className="font-semibold text-brand-primary hover:text-brand-accent transition-colors group-hover:text-brand-accent">
          {brand} {model} {variant}
        </h3>
        <p className="text-sm text-brand-secondary/60 mb-2">
          {colour} · Available
        </p>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-bold text-brand-primary">{formatInr(exShowroomPrice)}</span>
          <span className="text-xs text-brand-secondary/60">Ex-showroom</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="w-full py-2 rounded-md border border-brand-secondary text-brand-primary text-sm font-medium hover:bg-brand-secondary/10 transition-colors"
            onClick={() => {}}
          >
            Enquire Now
          </button>
          <button
            className="w-full py-2 rounded-md bg-brand-primary text-white text-sm font-medium hover:bg-brand-accent transition-colors disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => {}}
            disabled={availabilityStatus !== 'available'}
          >
            Book Test Ride
          </button>
        </div>
      </div>
    </article>
  );
}
