'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface ProviderRow {
  id: string;
  code: string;
  name: string;
  isEnabled: boolean;
  requiresCredentials: boolean;
  configured: boolean;
  attributionText: string | null;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  rateLimitPerMinute: number;
  _count: { models: number };
  syncRuns: { id: string; status: string; startedAt: string; errorCount: number }[];
}

interface RunRow {
  id: string;
  trigger: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  modelsSeen: number;
  modelsCreated: number;
  modelsUpdated: number;
  variantsSeen: number;
  variantsCreated: number;
  variantsUpdated: number;
  errorCount: number;
  provider: { code: string; name: string };
}

interface ErrorRow {
  id: string;
  level: string;
  message: string;
  entityType: string | null;
  externalId: string | null;
  createdAt: string;
  run: { provider: { code: string }; startedAt: string } | null;
}

export default function BikeSyncPage() {
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [errors, setErrors] = useState<ErrorRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [pRes, rRes, eRes] = await Promise.all([
        fetch('/api/admin/data-providers'),
        fetch('/api/admin/bike-sync/runs?limit=25'),
        fetch('/api/admin/bike-sync/errors?limit=50'),
      ]);
      const [pBody, rBody, eBody] = await Promise.all([pRes.json(), rRes.json(), eRes.json()]);
      if (!pRes.ok) throw new Error(pBody?.error?.message ?? 'Failed to load providers');
      setProviders(pBody.data);
      setRuns(rRes.ok ? rBody.data : []);
      setErrors(eRes.ok ? eBody.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sync status');
    }
  }, []);

  useEffect(() => {
    // Initial load on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const trigger = async (code: string) => {
    setBusy(code);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/admin/bike-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerCode: code }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message ?? 'Synchronisation failed');
      setMessage(
        `${body.data.providerCode}: ${body.data.status} — ${body.data.modelsCreated} created, ${body.data.modelsUpdated} updated, ${body.data.errorCount} error(s).`,
      );
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Synchronisation failed');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Data Synchronisation</h2>
        <p className="text-sm text-brand-secondary">
          Providers manage motorcycle information. Synchronisation never changes staff pricing.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
      )}

      <section>
        <h3 className="mb-2 font-semibold">Providers</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => (
            <div key={p.id} className="rounded-lg border bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{p.name}</span>
                {p.configured ? (
                  <Badge variant="success">Configured</Badge>
                ) : (
                  <Badge variant="warning">Awaiting credentials</Badge>
                )}
              </div>
              <p className="mt-1 text-xs text-brand-secondary">{p.attributionText}</p>
              <p className="mt-1 text-xs text-brand-secondary">
                {p._count.models} model(s) • {p.rateLimitPerMinute}/min
                {p.lastSyncAt
                  ? ` • last sync ${new Date(p.lastSyncAt).toLocaleString()} (${p.lastSyncStatus})`
                  : ' • never synced'}
              </p>
              <Button
                className="mt-3"
                size="sm"
                disabled={busy === p.code || !p.configured}
                onClick={() => void trigger(p.code)}
              >
                {busy === p.code ? 'Syncing…' : 'Sync now'}
              </Button>
            </div>
          ))}
          {providers.length === 0 && (
            <p className="text-sm text-brand-secondary">No providers registered yet.</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Recent runs</h3>
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Models</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Errors</TableHead>
                <TableHead>Started</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-brand-secondary">
                    No synchronisation runs yet.
                  </TableCell>
                </TableRow>
              ) : (
                runs.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.provider?.name ?? r.provider?.code}</TableCell>
                    <TableCell>{r.trigger}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          r.status === 'SUCCESS'
                            ? 'success'
                            : r.status === 'FAILED'
                              ? 'destructive'
                              : 'warning'
                        }
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {r.modelsCreated} new / {r.modelsUpdated} updated / {r.modelsSeen} seen
                    </TableCell>
                    <TableCell>
                      {r.variantsCreated} new / {r.variantsUpdated} updated / {r.variantsSeen} seen
                    </TableCell>
                    <TableCell>{r.errorCount}</TableCell>
                    <TableCell className="text-xs">
                      {new Date(r.startedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Synchronisation errors</h3>
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-brand-secondary">
                    No synchronisation errors recorded.
                  </TableCell>
                </TableRow>
              ) : (
                errors.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-xs">
                      {new Date(e.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{e.run?.provider?.code ?? '—'}</TableCell>
                    <TableCell>
                      {e.entityType ?? '—'}
                      {e.externalId ? ` (${e.externalId})` : ''}
                    </TableCell>
                    <TableCell className="text-xs">{e.message}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
