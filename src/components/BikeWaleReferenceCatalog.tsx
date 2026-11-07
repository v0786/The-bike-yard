import React, { useEffect, useState } from 'react';

type ReferenceBike = {
  brand: string;
  model: string;
  variant?: string;
  engineCc?: number;
  imageUrl?: string;
  sourceUrl?: string;
};
type FeedResponse = { bikes?: ReferenceBike[]; configured?: boolean; message?: string };

export function BikeWaleReferenceCatalog() {
  const [items, setItems] = useState<ReferenceBike[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const endpoint = import.meta.env.VITE_BIKEWALE_CATALOG_URL as string | undefined;

  useEffect(() => {
    if (!endpoint) {
      setStatus('unavailable');
      return;
    }
    const controller = new AbortController();
    fetch(endpoint, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Reference feed unavailable');
        return response.json() as Promise<FeedResponse>;
      })
      .then((data) => {
        if (!data.configured || !Array.isArray(data.bikes)) {
          setStatus('unavailable');
          return;
        }
        setItems(data.bikes);
        setStatus('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('unavailable');
      });
    return () => controller.abort();
  }, [endpoint]);

  if (status !== 'ready' || items.length === 0) return null;

  return (
    <section aria-label="BikeWale reference catalogue" className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-white">Motorcycle reference catalogue</h2>
        <p className="text-sm text-slate-400">
          Specifications and licensed images sourced from BikeWale. Reference only — not dealership stock, live pricing or a booking offer.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 24).map((bike, index) => (
          <article key={bike.sourceUrl ?? `${bike.brand}-${bike.model}-${index}`} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
            {bike.imageUrl && (
              <img src={bike.imageUrl} alt={`${bike.brand} ${bike.model}`} loading="lazy" referrerPolicy="no-referrer" className="h-40 w-full object-cover" />
            )}
            <div className="space-y-2 p-4">
              <h3 className="font-semibold text-white">{bike.brand} {bike.model}</h3>
              {bike.variant && <p className="text-sm text-slate-300">{bike.variant}</p>}
              {typeof bike.engineCc === 'number' && <p className="text-xs text-slate-400">{bike.engineCc} cc</p>}
              {bike.sourceUrl && <a href={bike.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-400 underline">View BikeWale reference</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
