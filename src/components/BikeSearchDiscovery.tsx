import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bike, ExternalLink, LoaderCircle, Search } from 'lucide-react';
import { PRICE_ENQUIRY, PRICE_EXPLANATION, rankBikeResults, type BikeSearchResponse } from '../lib/bike-search';
import type { Motorcycle } from '../types';

export function BikeSearchDiscovery({ query, bikes, noLocalResults }: { query: string; bikes: Motorcycle[]; noLocalResults: boolean }) {
  const [response, setResponse] = useState<BikeSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const normalized = query.trim();
  const related = useMemo(() => {
    const ranked = rankBikeResults(bikes, normalized);
    return (ranked.length ? ranked : bikes).slice(0, 3);
  }, [bikes, normalized]);
  useEffect(() => {
    setResponse(null); setError(''); setLoading(false);
    if (normalized.length < 2 || normalized.length > 100) return;
    let controller: AbortController | undefined;
    const load = async () => {
      if (document.hidden) return;
      controller?.abort(); controller = new AbortController();
      const request = controller;
      setLoading(true);
      try {
        const res = await fetch(`/api/bike-search?q=${encodeURIComponent(normalized)}`, { signal: request.signal });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Reference search is temporarily unavailable.');
        if (!Array.isArray(data.results) || !Array.isArray(data.sources)) throw new Error('Reference search is temporarily unavailable.');
        if (!request.signal.aborted) { setResponse(data); setError(''); }
      } catch (err) {
        if (!request.signal.aborted) setError(err instanceof Error ? err.message : 'Unable to refresh reference results.');
      } finally { if (!request.signal.aborted) setLoading(false); }
    };
    const debounce = window.setTimeout(load, 650);
    const interval = window.setInterval(load, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', load);
    return () => { clearTimeout(debounce); clearInterval(interval); document.removeEventListener('visibilitychange', load); controller?.abort(); };
  }, [normalized]);
  if (!normalized || normalized.length < 2) return null;
  return (
    <section aria-label="Bike search discovery" className="space-y-5 rounded-2xl border border-amber-500/30 bg-slate-900/60 p-4 sm:p-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-400">Find your next bike</p>
        <h3 className="mt-1 text-xl font-bold text-white">Searching for “{normalized}”</h3>
        <p className="mt-2 text-base text-slate-300">{noLocalResults ? 'No exact match with your current showroom filters. Explore possible matches and related bikes below.' : 'Explore showroom matches and additional manufacturer/reference information.'}</p>
        <p className="mt-1 text-sm text-slate-400">{PRICE_ENQUIRY}. {PRICE_EXPLANATION} External listings do not confirm Bike Yard stock or current India availability.</p>
      </div>
      {noLocalResults && related.length > 0 && <div>
        <h4 className="mb-2 text-base font-semibold text-white">Related showroom bikes · some filters may differ</h4>
        <div className="grid gap-3 sm:grid-cols-3">{related.map(b => <Link key={b.id} to={`/bike/${b.id}`} className="rounded-xl border border-slate-700 bg-slate-950 p-4 hover:border-amber-500">
          <Bike className="mb-2 h-5 w-5 text-amber-400" aria-hidden="true" />
          <span className="block text-base font-semibold text-white">{b.brand} {b.model}</span>
          <span className="mt-1 block text-sm text-slate-400">{b.engineCc} cc · {b.category}</span>
          <span className="mt-2 block text-sm text-amber-400">{PRICE_ENQUIRY}</span>
        </Link>)}</div>
      </div>}
      <div aria-live="polite" role="status" className="text-sm text-slate-400">
        {loading && <span className="flex items-center gap-2"><LoaderCircle className="h-4 w-4 animate-spin" />Checking public bike sources…</span>}
        {error && <p>{error} Related showroom bikes remain available.</p>}
        {response && <p>{response.sources.map(s => `${s.name}: ${s.available ? s.stale ? 'last saved reference' : 'retrieved' : 'unavailable'}`).join(' · ')}</p>}
      </div>
      {response && response.results.length > 0 && <div>
        <h4 className="mb-3 text-base font-semibold text-white">External reference matches</h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{response.results.map(b => <article key={b.sourceUrl} className="flex flex-col rounded-xl border border-slate-700 bg-slate-950 p-4">
          <p className="text-sm text-amber-400">{b.exact ? 'Name match' : 'Possible match — check model name'} · {b.source}</p>
          <h5 className="mt-2 text-lg font-semibold text-white">{b.brand} {b.model}</h5>
          {b.specifications && b.specifications.length > 0 && <dl className="my-3 space-y-2 text-sm">{b.specifications.slice(0, 5).map(spec => <div key={spec.label} className="flex justify-between gap-3"><dt className="text-slate-400">{spec.label}</dt><dd className="text-right text-slate-200">{spec.value}</dd></div>)}</dl>}
          <p className="mb-3 mt-2 text-sm font-semibold text-amber-400">{PRICE_ENQUIRY}</p>
          <p className="mt-auto text-sm text-slate-400">{b.stale ? 'Saved reference · refresh unavailable' : 'Retrieved'} {new Date(b.retrievedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          <a href={b.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 text-sm text-amber-400 underline">Read source <ExternalLink className="h-4 w-4" /></a>
        </article>)}</div>
      </div>}
      {response && response.results.length === 0 && <p className="text-base text-slate-300">We couldn’t verify that exact model name from the available sources. Try a shorter model name or ask our team—we won’t invent a result.</p>}
      <div className="flex flex-wrap gap-3 text-sm">
        <a className="rounded-xl border border-slate-700 px-4 py-2 text-amber-400" href={`https://www.google.com/search?q=${encodeURIComponent(normalized + ' motorcycle India specifications')}`} target="_blank" rel="noopener noreferrer">Search on Google</a>
        <a className="rounded-xl border border-slate-700 px-4 py-2 text-amber-400" href={`https://www.google.com/search?q=${encodeURIComponent('site:bikewale.com ' + normalized)}`} target="_blank" rel="noopener noreferrer">Find BikeWale references</a>
        <Link className="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-slate-950" to="/#visit-showroom">Ask Bike Yard about this bike</Link>
      </div>
    </section>
  );
}
