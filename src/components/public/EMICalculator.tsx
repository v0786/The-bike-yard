'use client';

// EMI Calculator component for public pages
// Follows DESIGN.md §8.3 - labeled as estimate, no invented rates

import * as React from 'react';
import { cn } from '@/lib/utils';
import { formatInr } from '@/lib/currency';

interface EMICalculatorProps {
  defaultLoanAmount?: number;
  defaultInterestRate?: number; // percentage per year
  defaultTenureMonths?: number;
}

export function EMICalculator({
  defaultLoanAmount = 500000,
  defaultInterestRate = 10,
  defaultTenureMonths = 36,
}: EMICalculatorProps) {
  const [loanAmount, setLoanAmount] = React.useState(defaultLoanAmount);
  const [interestRate, setInterestRate] = React.useState(defaultInterestRate);
  const [tenureMonths, setTenureMonths] = React.useState(defaultTenureMonths);

  const monthlyRate = interestRate / 100 / 12;
  const emi =
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1)
      : loanAmount / tenureMonths;

  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - loanAmount;

  return (
    <div className="bg-white rounded-lg border border-brand-secondary p-6 shadow-sm">
      <h3 className="font-bold text-brand-primary text-lg mb-4">EMI Calculator</h3>
      <p className="text-xs text-brand-secondary/60 mb-4">
        Estimated monthly instalment. Actual EMI may vary based on lender terms and down payment.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs text-brand-secondary/60 mb-1">Loan Amount (₹)</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <div>
          <label className="block text-xs text-brand-secondary/60 mb-1">Interest Rate (% p.a.)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <div>
          <label className="block text-xs text-brand-secondary/60 mb-1">Tenure (months)</label>
          <input
            type="number"
            value={tenureMonths}
            onChange={(e) => setTenureMonths(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center p-4 rounded-md bg-brand-secondary/5">
        <div>
          <div className="text-2xl font-bold text-brand-primary">{formatInr(Math.round(emi))}</div>
          <div className="text-xs text-brand-secondary/60">Monthly EMI</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-brand-primary">{formatInr(Math.round(totalInterest))}</div>
          <div className="text-xs text-brand-secondary/60">Total Interest</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-brand-primary">{formatInr(Math.round(totalPayable))}</div>
          <div className="text-xs text-brand-secondary/60">Total Payable</div>
        </div>
      </div>
    </div>
  );
}
