import type { FC } from 'react';
import { ArrowRight, MessageCircle, Phone, ShieldCheck, Landmark, ClipboardCheck, IndianRupee } from 'lucide-react';
import { whatsAppLink, telLink } from '../lib/whatsapp';

interface ShowroomHeroProps {
  inStockTotal: number;
  phone: string;
  onExploreClick: () => void;
  onTestRideClick: () => void;
  onEmiClick: () => void;
}

export const ShowroomHero: FC<ShowroomHeroProps> = ({
  inStockTotal,
  phone,
  onExploreClick,
  onTestRideClick,
  onEmiClick,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
      {/* Background showroom photograph, darkened for legibility */}
      <img
        src="/assets/images/hero_motorcycle_showroom_1793817699343.jpg"
        alt="The Bike Yard showroom floor in Khopat, Thane — motorcycles on display"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-center opacity-45 sm:opacity-60"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 sm:via-slate-950/55 to-slate-950/10" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] flex-col justify-end pb-10 pt-24 sm:pb-16 sm:pt-32 max-w-3xl">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-slate-950/70 backdrop-blur px-3 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
            Khopat, Thane (W) · MH-04 Authorised Showroom
          </div>

          <h1 className="display-heading mt-4 text-4xl sm:text-6xl lg:text-7xl text-white uppercase">
            Ride Home<br />
            <span className="text-amber-400">The Machine</span><br />
            You Deserve.
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-lg text-slate-200 leading-relaxed max-w-xl">
            Honda, Suzuki, TVS, Royal Enfield, KTM, Yamaha and more — with itemised
            MH-04 on-road pricing, test rides on tap and finance approvals in ~45 minutes.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-950 hover:bg-amber-400 active:scale-[0.98] transition-all"
            >
              Explore {inStockTotal} Ready Bikes
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href={whatsAppLink(phone, 'Hi The Bike Yard! I would like to enquire about a motorcycle.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white hover:bg-emerald-500 active:scale-[0.98] transition-all"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={telLink(phone)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-950/70 backdrop-blur px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-100 hover:text-white hover:border-slate-400 active:scale-[0.98] transition-all"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <span className="hidden sm:inline">{phone}</span>
              <span className="sm:hidden">Call Now</span>
            </a>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] sm:text-xs text-slate-300">
            <button onClick={onTestRideClick} className="underline underline-offset-4 decoration-amber-500/60 hover:text-white transition-colors font-semibold">
              Book a free test ride
            </button>
            <button onClick={onEmiClick} className="underline underline-offset-4 decoration-amber-500/60 hover:text-white transition-colors font-semibold">
              Calculate on-road EMI
            </button>
          </div>

          {/* Trust strip */}
          <dl className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 border-t border-white/10 pt-5 sm:pt-6 max-w-2xl">
            {[
              { icon: ShieldCheck, k: 'Authorised', v: 'Honda · Suzuki · TVS' },
              { icon: IndianRupee, k: 'Zero Hidden Fees', v: 'Itemised on-road bill' },
              { icon: Landmark, k: '~45-Min Finance', v: '10+ lender partners' },
              { icon: ClipboardCheck, k: '45-Point PDI', v: 'Certified pre-owned' },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k} className="flex items-start gap-2">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white">{k}</dt>
                  <dd className="text-[9px] sm:text-[10px] text-slate-400 leading-snug mt-0.5">{v}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
