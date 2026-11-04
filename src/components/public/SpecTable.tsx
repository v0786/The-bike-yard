'use client';

// Spec table component for bike detail page
// Follows DESIGN.md §8.3

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SpecTableProps {
  specifications: Record<string, string | number>;
}

export function SpecTable({ specifications }: SpecTableProps) {
  const entries = Object.entries(specifications);

  return (
    <div className="bg-white rounded-lg border border-brand-secondary p-6 shadow-sm">
      <h3 className="font-bold text-brand-primary text-lg mb-4">Specifications</h3>
      <table className="w-full text-sm border-collapse">
        <tbody className="divide-y divide-brand-secondary/10">
          {entries.map(([key, value]) => (
            <tr key={key} className="text-left">
              <td className="py-3 text-brand-secondary/60 w-1/3">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              </td>
              <td className="py-3 text-brand-primary font-medium">
                {String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
