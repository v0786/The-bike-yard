import type { Motorcycle } from '../types';
import { PRICE_ENQUIRY } from '../lib/bike-search';
interface Props {
  selectedBike: Motorcycle; bikes: Motorcycle[]; onSelectBike: (bike: Motorcycle) => void;
  onOpenBooking: (bike: Motorcycle) => void; onOpenTestRide: (bike: Motorcycle) => void; onOpenSpecs: (bike: Motorcycle) => void;
}
export function PersistentOnRoadBar({ selectedBike, onOpenSpecs, onOpenTestRide }: Props) {
  return <aside aria-label="Selected bike enquiry" className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-slate-700 bg-slate-950/95 p-3 backdrop-blur md:bottom-0">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
      <div><p className="text-sm font-bold text-white">{selectedBike.brand} {selectedBike.model}</p><p className="text-sm text-amber-400">{PRICE_ENQUIRY}</p></div>
      <div className="flex gap-2"><button onClick={() => onOpenSpecs(selectedBike)} className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-white">View specifications</button><button onClick={() => onOpenTestRide(selectedBike)} className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-bold text-slate-950">Enquire / test ride</button></div>
    </div>
  </aside>;
}
