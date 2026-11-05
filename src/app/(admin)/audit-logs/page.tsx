// Admin Audit Logs page
// Follows AUTH_SECURITY.md §11, API.md §13

import type { Metadata } from '@/types/metadata';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'The Bike Yard — Audit Logs',
  description: 'View audit logs for privileged and financial actions.',
};

export default function AuditLogsPage() {
  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
            Audit Logs
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
            Audit Logs
          </h1>
          <p className="text-brand-secondary/60 text-lg">
            View activity log for privileged and financial actions.
          </p>
        </div>

        <AuditLogsList />
      </div>
    </section>
  );
}

async function AuditLogsList() {
  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { timestamp: 'desc' },
    take: 50,
  });

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-brand-secondary">
      <h3 className="font-bold text-brand-primary text-sm uppercase mb-6">Recent Activity</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-secondary/10">
          <thead>
            <tr className="border-b border-brand-secondary">
              <th className="text-left text-sm font-medium text-brand-primary pb-3">User</th>
              <th className="text-left text-sm font-medium text-brand-primary pb-3">Action</th>
              <th className="text-left text-sm font-medium text-brand-primary pb-3">Details</th>
              <th className="text-left text-sm font-medium text-brand-primary pb-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="text-left">
                <td className="py-4 text-sm">
                  {log.user?.name ?? log.performedBy} {log.user?.email ? `(${log.user.email})` : ''}
                </td>
                <td className="py-4 text-sm text-brand-secondary">{log.action}</td>
                <td className="py-4 text-sm text-brand-secondary">{log.details}</td>
                <td className="py-4 text-sm text-brand-secondary/60">{new Date(log.timestamp).toLocaleString('en-IN')}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-brand-secondary/60">No audit logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
