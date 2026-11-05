'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatInr } from '@/lib/currency';

interface PriceHistoryEntry {
  id: string;
  changeType: string;
  previousExShowroomPaise: number | null;
  newExShowroomPaise: number | null;
  staffName: string;
  reason: string | null;
  createdAt: string;
}

interface Pricing {
  id: string;
  exShowroomPricePaise: number;
  onRoadPricePaise: number | null;
  dealerOfferPaise: number;
  finalSellingPricePaise: number | null;
  isPublished: boolean;
  updatedByName: string;
  updatedAt: string;
}

interface Variant {
  id: string;
  name: string;
  engineCc: number | null;
  powerBhp: number | null;
  torqueNm: number | null;
  mileageKmpl: number | null;
  transmission: string | null;
  absType: string | null;
  kerbWeightKg: number | null;
  features: string[] | null;
  colours: { id: string; name: string; hexCode: string | null }[];
  images: { id: string; url: string; alt: string | null; licence: string | null }[];
  pricing: Pricing | null;
  priceHistory: PriceHistoryEntry[];
}

interface ModelDetail {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  technicalDescription: string | null;
  sourceAttribution: string | null;
  lastSyncedAt: string | null;
  brand: { name: string } | null;
  provider: { name: string; attributionText: string | null } | null;
  variants: Variant[];
}

export function BikeModelDetail({ id }: { id: string }) {
  const [model, setModel] = useState<ModelDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/bike-catalogue/${id}`);
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error?.message ?? 'Failed to load');
        if (active) setModel(body.data);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (error)
    return (
      <p role="alert" className="p-6 text-red-700">
        {error}
      </p>
    );
  if (!model) return <p className="p-6">Not found.</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {model.brand?.name} {model.name}
          </h2>
          <p className="text-sm text-brand-secondary">
            {model.category ?? 'Motorcycle'} • Provider: {model.provider?.name ?? 'Unknown'} •{' '}
            {model.lastSyncedAt
              ? `Last sync ${new Date(model.lastSyncedAt).toLocaleString()}`
              : 'Never synced'}
          </p>
          <p className="mt-1 text-xs text-brand-secondary">
            {model.sourceAttribution ?? model.provider?.attributionText}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/bike-catalogue">Back to catalogue</Link>
        </Button>
      </div>

      {model.description && (
        <section className="rounded-lg border bg-white p-4">
          <h3 className="font-semibold mb-1">Description</h3>
          <p className="text-sm text-brand-secondary">{model.description}</p>
          {model.technicalDescription && (
            <p className="mt-2 text-sm text-brand-secondary">{model.technicalDescription}</p>
          )}
        </section>
      )}

      {model.variants.map((variant) => (
        <section key={variant.id} className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{variant.name}</h3>
            <div className="flex items-center gap-2">
              {variant.pricing?.isPublished ? (
                <Badge variant="success">Price published</Badge>
              ) : variant.pricing ? (
                <Badge variant="warning">Price unpublished</Badge>
              ) : (
                <Badge variant="outline">No staff price</Badge>
              )}
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/bike-pricing?q=${encodeURIComponent(model.name)}`}>
                  Manage pricing
                </Link>
              </Button>
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {spec('Engine', variant.engineCc ? `${variant.engineCc} cc` : null)}
            {spec('Power', variant.powerBhp ? `${variant.powerBhp} bhp` : null)}
            {spec('Torque', variant.torqueNm ? `${variant.torqueNm} Nm` : null)}
            {spec('Mileage', variant.mileageKmpl ? `${variant.mileageKmpl} kmpl` : null)}
            {spec('Transmission', variant.transmission)}
            {spec('ABS', variant.absType)}
            {spec('Kerb weight', variant.kerbWeightKg ? `${variant.kerbWeightKg} kg` : null)}
          </dl>

          {variant.features && variant.features.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase text-brand-secondary">Features</p>
              <ul className="mt-1 flex flex-wrap gap-2">
                {variant.features.map((f) => (
                  <li key={f}>
                    <Badge variant="secondary">{f}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {variant.colours.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase text-brand-secondary">Colours</p>
              <ul className="mt-1 flex flex-wrap gap-2">
                {variant.colours.map((c) => (
                  <li key={c.id} className="flex items-center gap-1 text-sm">
                    <span
                      className="inline-block h-4 w-4 rounded-full border"
                      style={{ backgroundColor: c.hexCode ?? '#ccc' }}
                      aria-hidden
                    />
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm">
            <p className="font-medium">Staff-managed pricing (read-only here)</p>
            {variant.pricing ? (
              <p className="text-brand-secondary">
                Ex-showroom {formatInr(variant.pricing.exShowroomPricePaise)} • On-road{' '}
                {formatInr(variant.pricing.onRoadPricePaise ?? variant.pricing.finalSellingPricePaise)}
                {' • '}Updated by {variant.pricing.updatedByName} on{' '}
                {new Date(variant.pricing.updatedAt).toLocaleString()}
              </p>
            ) : (
              <p className="text-brand-secondary">No pricing set by staff yet.</p>
            )}
          </div>

          {variant.priceHistory.length > 0 && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer font-medium">Price history</summary>
              <ul className="mt-2 space-y-1">
                {variant.priceHistory.map((h) => (
                  <li key={h.id} className="text-brand-secondary">
                    {new Date(h.createdAt).toLocaleString()} — {h.changeType}:{' '}
                    {formatInr(h.previousExShowroomPaise ?? 0)} → {formatInr(h.newExShowroomPaise ?? 0)}{' '}
                    by {h.staffName}
                    {h.reason ? ` (${h.reason})` : ''}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      ))}
    </div>
  );
}

function spec(label: string, value: string | null) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-brand-secondary">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
