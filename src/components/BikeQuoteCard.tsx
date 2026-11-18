import { PRICE_ENQUIRY, PRICE_EXPLANATION } from '../lib/bike-search';
import { DEALERSHIP_INFO } from '../data/dealershipData';
import { whatsAppLink } from '../lib/whatsapp';
export function BikeQuoteCard({ model = 'this bike' }: { model?: string }) {
  return <div className="my-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5">
    <p className="text-lg font-bold text-amber-400">{PRICE_ENQUIRY}</p>
    <p className="mt-2 text-base text-slate-300">{PRICE_EXPLANATION} Ask our team for a personalised quote, applicable charges and finance options.</p>
    <a href={whatsAppLink(DEALERSHIP_INFO.phone, `Hi Bike Yard, please confirm the negotiable price and availability of ${model}.`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950">Request price from Bike Yard</a>
  </div>;
}
