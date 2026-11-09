import { useEffect, useState } from 'react';
import { getBackendBikewaleCatalog, isBackendConfigured, type BackendBikewaleFeed, type BackendBikewaleBike } from '../services/backendClient';

function bikeWaleListing(value?: string) {
  try {
    const url = new URL(value ?? '');
    return url.protocol === 'https:' && !url.username && !url.password &&
      (url.hostname === 'bikewale.com' || url.hostname.endsWith('.bikewale.com')) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function BikeWaleReferenceCatalog() {
  const [items, setItems] = useState<BackendBikewaleBike[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const endpoint = (import.meta.env.VITE_BIKEWALE_CATALOG_URL as string | undefined)?.trim();

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        let data: BackendBikewaleFeed | null = null;
        if (endpoint) {
          const response = await fetch(endpoint, { signal: controller.signal });
          if (!response.ok) throw new Error('Reference feed unavailable');
          data = (await response.json()) as BackendBikewaleFeed;
        } else if (isBackendConfigured()) {
          data = await getBackendBikewaleCatalog();
        } else {
          setStatus('unavailable');
          return;
        }

        if (!data?.configured || !Array.isArray(data.bikes) || data.bikes.length === 0) {
          setStatus('unavailable');
          return;
        }
        setItems(data.bikes);
        setStatus('ready');
      } catch {
        if (!controller.signal.aborted) setStatus('unavailable');
      }
    };

    load();
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
        {items.slice(0, 24).map((bike, index) => {
          const listing = bikeWaleListing(bike.sourceUrl);
          const retrievedAt = bike.retrievedAt ? new Date(bike.retrievedAt) : null;
          return (
            <article key={`${bike.brand}-${bike.model}-${index}`} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
              {bike.imageUrl && (
                <img src={bike.imageUrl} alt={`${bike.brand} ${bike.model}`} loading="lazy" referrerPolicy="no-referrer" className="h-40 w-full object-cover" />
              )}
              <div className="space-y-2 p-4">
                <h3 className="font-semibold text-white">{bike.brand} {bike.model}</h3>
                {bike.variant && <p className="text-sm text-slate-300">{bike.variant}</p>}
                {typeof bike.engineCc === 'number' && <p className="text-xs text-slate-400">{bike.engineCc} cc</p>}
                <p className="text-xs text-slate-400">{retrievedAt && Number.isFinite(retrievedAt.getTime())
                  ? `Retrieved ${retrievedAt.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}`
                  : 'Reference retrieval date unavailable'}</p>
                {listing && <a href={listing} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-400 underline">View BikeWale reference</a>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
