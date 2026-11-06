import React from 'react';
import { ShieldCheck, MapPin, Clock, ArrowRight, Gauge, IndianRupee, Sparkles } from 'lucide-react';
import { formatInr } from '../lib/currency';

interface ShowroomHeroProps {
  inStockTotal: number;
  onExploreClick: () => void;
  onTestRideClick: () => void;
  onEmiClick: () => void;
}

export const ShowroomHero: React.FC<ShowroomHeroProps> = ({
  inStockTotal,
  onExploreClick,
  onTestRideClick,
  onEmiClick,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 pt-6 pb-12 sm:pt-10 sm:pb-16">
      {/* Background glow overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pointer-events-none blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>Khopat, Thane (W) — MH-04 Authorized Digital Showroom</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
              Precision Motorcycles. Transparent On-Road Pricing. Ready in Thane.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Authorized showroom and certified pre-owned delivery centre in Rutu Business Park, Khopat. Experience pure integer paise financial transparency with Maharashtra RTO (MH-04) taxes and instant 45-minute loan disbursals.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition-all"
              >
                <span>Explore Live Stock ({inStockTotal} Units)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onTestRideClick}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-slate-500 hover:text-white active:scale-95 transition-all"
              >
                <span>Book Test Ride</span>
              </button>
              <button
                onClick={onEmiClick}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-amber-400 hover:text-amber-300 underline underline-offset-4 px-2 py-3"
              >
                <span>Calculate On-Road EMI</span>
              </button>
            </div>

            {/* Real-world trust markers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">MH-04 Central RTO</div>
                <div className="text-sm font-bold text-white">Direct Transfer</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">Bank Approvals</div>
                <div className="text-sm font-bold text-white">45-Min In-Store</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">PDI Inspection</div>
                <div className="text-sm font-bold text-white">45-Point Certified</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">Pricing Guarantee</div>
                <div className="text-sm font-bold text-amber-400">Zero Hidden Fees</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Banner */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-2 shadow-2xl overflow-hidden group">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <img
                  src="/src/assets/images/hero_motorcycle_showroom_1793817699343.jpg"
                  alt="The Bike Yard Motorcycle Showroom in Khopat Thane"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                {/* Floating stock pill */}
                <div className="absolute top-3 right-3 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{inStockTotal} Physical Units Ready</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">Khopat Showroom Floor</div>
                  <div className="text-base font-bold text-white">Flagship Sports & Cruisers On Display</div>
                  <div className="text-xs text-slate-300">Shop 4 & 5, Rutu Business Park, Near Cadbury Jct</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
