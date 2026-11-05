'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatInr, toPaise } from '@/lib/currency';

interface PricingRow {
  id: string;
  variantId: string;
  exShowroomPricePaise: number;
  onRoadPricePaise: number | null;
  dealerOfferPaise: number;
  isPublished: boolean;
  updatedByName: string;
  updatedAt: string;
  variant: {
    id: string;
    name: string;
    model: { name: string; brand: { name: string } | null };
  };
}

interface HistoryRow {
  id: string;
  changeType: string;
  previousExShowroomPaise: number | null;
  newExShowroomPaise: number | null;
  staffName: string;
  reason: string | null;
  createdAt: string;
}

export default function BikePricingPage() {
  const [rows, setRows] = useState<PricingRow[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selected, setSelected] = useState<PricingRow | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);

  const [form, setForm] = useState({
    exShowroom: '',
    onRoad: '',
    dealerOffer: '',
    reason: '',
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (searchTerm: string) => {
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/bike-pricing${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ''}`,
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message ?? 'Failed to load pricing');
      setRows(body.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load pricing');
    }
  }, []);

  useEffect(() => {
    // Initial load on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load('');
  }, [load]);

  const openEditor = async (row: PricingRow) => {
    setSelected(row);
    setNotice(null);
    setForm({
      exShowroom: String(row.exShowroomPricePaise / 100),
      onRoad: row.onRoadPricePaise != null ? String(row.onRoadPricePaise / 100) : '',
      dealerOffer: row.dealerOfferPaise ? String(row.dealerOfferPaise / 100) : '0',
      reason: '',
    });
    const res = await fetch(`/api/admin/bike-pricing/${row.variantId}/history`);
    const body = await res.json();
    setHistory(res.ok ? body.data : []);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const payload = {
        variantId: selected.variantId,
        exShowroomPricePaise: Number(toPaise(form.exShowroom || '0')),
        onRoadPricePaise: form.onRoad ? Number(toPaise(form.onRoad)) : undefined,
        dealerOfferPaise: Number(toPaise(form.dealerOffer || '0')),
        reason: form.reason || undefined,
      };
      const res = await fetch('/api/admin/bike-pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message ?? 'Failed to save price');
      setNotice('Price saved. Previous value recorded in the audit history.');
      await load(query);
      await openEditor({ ...selected, ...body.data, variant: selected.variant });
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Failed to save price');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (row: PricingRow) => {
    setError(null);
    try {
      const res = await fetch('/api/admin/bike-pricing/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: row.variantId, isPublished: !row.isPublished }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message ?? 'Failed to update approval');
      setNotice(body.data.isPublished ? 'Price published.' : 'Price unpublished.');
      await load(query);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update approval');
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Motorcycle Pricing</h2>
          <p className="text-sm text-brand-secondary">
            Staff-managed pricing only. Imported specifications cannot be edited here.
          </p>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void load(query);
          }}
        >
          <Input
            aria-label="Search pricing by brand, model or variant"
            placeholder="Search pricing…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{notice}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bike</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Ex-showroom</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated by</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-brand-secondary">
                    No pricing records. Import catalogue data, then set prices for its variants.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      {row.variant.model.brand?.name} {row.variant.model.name}
                    </TableCell>
                    <TableCell>{row.variant.name}</TableCell>
                    <TableCell>{formatInr(row.exShowroomPricePaise)}</TableCell>
                    <TableCell>
                      {row.isPublished ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge variant="warning">Unpublished</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {row.updatedByName}
                      <br />
                      {new Date(row.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => void openEditor(row)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => void togglePublish(row)}>
                          {row.isPublished ? 'Unpublish' : 'Publish'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <aside className="rounded-lg border bg-white p-4">
          {selected ? (
            <>
              <h3 className="font-semibold">
                {selected.variant.model.brand?.name} {selected.variant.model.name} —{' '}
                {selected.variant.name}
              </h3>
              <form className="mt-3 space-y-3" onSubmit={save}>
                <label className="block text-sm">
                  Ex-showroom (₹)
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.exShowroom}
                    onChange={(e) => setForm({ ...form, exShowroom: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  On-road (₹, optional)
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.onRoad}
                    onChange={(e) => setForm({ ...form, onRoad: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  Dealer offer (₹)
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.dealerOffer}
                    onChange={(e) => setForm({ ...form, dealerOffer: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  Reason (recorded in audit history)
                  <Input
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="e.g. festive revision"
                  />
                </label>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save price'}
                </Button>
              </form>

              <div className="mt-4">
                <h4 className="text-sm font-semibold">Price history</h4>
                {history.length === 0 ? (
                  <p className="text-xs text-brand-secondary">No changes recorded yet.</p>
                ) : (
                  <ul className="mt-1 space-y-1 text-xs text-brand-secondary">
                    {history.map((h) => (
                      <li key={h.id}>
                        {new Date(h.createdAt).toLocaleString()} — {h.changeType}:{' '}
                        {formatInr(h.previousExShowroomPaise ?? 0)} →{' '}
                        {formatInr(h.newExShowroomPaise ?? 0)} ({h.staffName})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-brand-secondary">
              Select a row to edit its price. Every change records the staff member and prior
              value.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
