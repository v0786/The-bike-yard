// Admin Expenses page
// Follows FEATURES.md, DATABASE.md expense model

import type { Metadata } from '@/types/metadata';
import { prisma } from '@/lib/prisma';
import { formatInr } from '@/lib/currency';

export const metadata: Metadata = {
  title: 'The Bike Yard — Expenses',
  description: 'Manage dealership expenses for The Bike Yard.',
};

export default function ExpensesPage() {
  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
            Expenses
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
            Expenses
          </h1>
          <p className="text-brand-secondary/60 text-lg">
            Record and track dealership expenses.
          </p>
        </div>

        <ExpensesList />
      </div>
    </section>
  );
}

async function ExpensesList() {
  const expenses = await prisma.expense.findMany({
    orderBy: { paymentDate: 'desc' },
  });
  const total = expenses.reduce((sum, e) => sum + e.amountPaise, 0n);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-brand-secondary p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-brand-primary text-lg">Total Expenses</h3>
          <span className="text-2xl font-bold text-brand-primary">{formatInr(total)}</span>
        </div>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow-sm border border-brand-secondary">
        <h3 className="font-bold text-brand-primary text-sm uppercase mb-6">Expense Records</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-secondary/10">
            <thead>
              <tr className="border-b border-brand-secondary">
                <th className="text-left text-sm font-medium text-brand-primary pb-3">Category</th>
                <th className="text-left text-sm font-medium text-brand-primary pb-3">Description</th>
                <th className="text-right text-sm font-medium text-brand-primary pb-3">Amount</th>
                <th className="text-left text-sm font-medium text-brand-primary pb-3">Paid To</th>
                <th className="text-left text-sm font-medium text-brand-primary pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="text-left">
                  <td className="py-4 text-sm">{e.category}</td>
                  <td className="py-4 text-sm text-brand-secondary">{e.description || '-'}</td>
                  <td className="py-4 text-sm text-right">{formatInr(e.amountPaise)}</td>
                  <td className="py-4 text-sm text-brand-secondary">{e.paidTo}</td>
                  <td className="py-4 text-sm text-brand-secondary/60">{new Date(e.paymentDate).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-brand-secondary/60">No expenses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
