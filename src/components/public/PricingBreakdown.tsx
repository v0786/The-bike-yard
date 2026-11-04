'use client';

// Pricing breakdown component for bike detail page
// Follows DESIGN.md §8.3 - all values from dealership-managed price list

import * as React from 'react';
import { cn } from '@/lib/utils';
import { formatInr } from '@/lib/currency';

interface PricingBreakdownProps {
  exShowroomPrice: number;
  insurancePrice: number;
  rtoCharges: number;
  accessoriesPrice: number;
  discount: number;
  finalSellingPrice: number;
  gstAmount: number;
  totalAmount: number;
}

export function PricingBreakdown({
  exShowroomPrice,
  insurancePrice,
  rtoCharges,
  accessoriesPrice,
  discount,
  finalSellingPrice,
  gstAmount,
  totalAmount,
}: PricingBreakdownProps) {
  return (
    <div className="bg-white rounded-lg border border-brand-secondary p-6 shadow-sm">
      <h3 className="font-bold text-brand-primary text-lg mb-4">Pricing Breakdown</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-brand-secondary/60">Ex-showroom price</span>
          <span className="font-medium">{formatInr(exShowroomPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-secondary/60">Insurance</span>
          <span className="font-medium">{formatInr(insurancePrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-secondary/60">RTO charges</span>
          <span className="font-medium">{formatInr(rtoCharges)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brand-secondary/60">Accessories</span>
          <span className="font-medium">{formatInr(accessoriesPrice)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="text-brand-secondary/60">Discount</span>
            <span className="font-medium">-{formatInr(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-semibold border-t border-brand-secondary/20 pt-3">
          <span className="text-brand-secondary/60">Final selling price</span>
          <span className="text-brand-primary">{formatInr(finalSellingPrice)}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-brand-secondary/20 pt-3">
          <span className="text-brand-secondary/60">GST</span>
          <span className="font-medium">{formatInr(gstAmount)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-brand-secondary/20 pt-3">
          <span className="text-brand-primary">Total (on-road)</span>
          <span className="text-brand-primary">{formatInr(totalAmount)}</span>
        </div>
      </div>
      <p className="text-xs text-brand-secondary/60 mt-4">
        All prices are in Indian Rupees (INR). GST breakdown (CGST/SGST/IGST) will be shown on the tax invoice.
      </p>
    </div>
  );
}
