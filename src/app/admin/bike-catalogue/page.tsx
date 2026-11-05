'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
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

interface VariantSummary {
  id: string;
  name: string;
  engineCc: number | null;
  pricing?: { isPublished: boolean; exShowroomPricePaise: number } | null;
}

interface BikeModelRow {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  brand: { name: string } | null;
  provider: { code: string; name: string; attributionText: string | null } | null;
  lastSyncedAt: string | null;
  sourceAttribution: string | null;
  variants: VariantSummary[];
  _count: { variants: number };
}

export default function BikeCataloguePage() {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<BikeModelRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/bike-catalogue?pageSize=50${searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ''}`,
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message ?? 'Failed to load');
      setRows(body.data);
      setTotal(body.meta.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load('');
  }, [load]);

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Motorcycle Catalogue</h2>
          <p className="text-sm text-brand-secondary">
            Imported specifications. Information is provider-managed; pricing is staff-managed.
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
            aria-label="Search by brand, model or variant"
            placeholder="Search brand, model, variant…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </Button>
        </form>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Last sync</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-brand-secondary">
                  No imported motorcycle models yet. Run a synchronisation from the Data Sync page.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const published = row.variants.filter((v) => v.pricing?.isPublished).length;
                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.brand?.name ?? '—'}</TableCell>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.category ?? '—'}</TableCell>
                    <TableCell>{row._count.variants}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.provider?.name ?? 'Unknown'}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {row.lastSyncedAt ? new Date(row.lastSyncedAt).toLocaleString() : 'Never'}
                    </TableCell>
                    <TableCell>
                      {published > 0 ? (
                        <Badge variant="success">{published} published</Badge>
                      ) : (
                        <Badge variant="warning">Unpublished</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/bike-catalogue/${row.id}`}>View</Link>
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/admin/bike-pricing?q=${encodeURIComponent(row.name)}`}>
                            Pricing
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <p className="mt-2 text-xs text-brand-secondary">
        {total} model{total === 1 ? '' : 's'} • provider attribution is shown per model
      </p>
    </div>
  );
}
