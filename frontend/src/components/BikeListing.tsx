import React, { useState } from 'react';
import { Motorcycle } from '../types';
import { formatInr } from '../lib/currency';
import { Search, CheckCircle2, AlertCircle, ArrowUpRight, ZoomIn, ShoppingBag, Check, Sparkles, Share2, Scale, Upload, FileSpreadsheet, X } from 'lucide-react';
import { cartStore } from '../services/cartStore';
import { dealershipStore } from '../services/dealershipStore';
import { getColorBikeImage } from '../data/dealershipData';

interface BikeListingProps {
  bikes: Motorcycle[];
  onSelectBike: (bike: Motorcycle) => void;
  onBookTestRide: (bike: Motorcycle) => void;
  onZoomBike?: (bike: Motorcycle) => void;
  onOpenOlxModal?: (bike: Motorcycle) => void;
  onOpenCsvUpload?: () => void;
  onOpenCompare?: (bikeA?: Motorcycle, bikeB?: Motorcycle) => void;
  compareBikeIds?: string[];
  onToggleCompareBike?: (bike: Motorcycle) => void;
  onClearCompare?: () => void;
  selectedBikeId?: string;
}

export const BikeListing: React.FC<BikeListingProps> = ({
  bikes,
  onSelectBike,
  onBookTestRide,
  onZoomBike,
  onOpenOlxModal,
  onOpenCsvUpload,
  onOpenCompare,
  compareBikeIds = [],
  onToggleCompareBike,
  onClearCompare,
  selectedBikeId,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBudget, setSelectedBudget] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [addedBikeId, setAddedBikeId] = useState<string | null>(null);

  const brands = ['ALL', 'Royal Enfield', 'KTM', 'Yamaha', 'Triumph', 'Bajaj', 'Honda', 'TVS', 'Hero'];
  const categories = ['ALL', 'Roadster', 'Sport', 'Cruiser', 'Scooter', 'Adventure', 'Commuter'];
  const budgets = [
    { id: 'ALL', label: 'All Budgets' },
    { id: 'UNDER_1L', label: 'Under ₹1 Lakh' },
    { id: '1L_2L', label: '₹1 - ₹2 Lakh' },
    { id: '2L_3L', label: '₹2 - ₹3 Lakh' },
    { id: 'ABOVE_3L', label: 'Above ₹3 Lakh' },
  ];

  const filteredBikes = bikes.filter((bike) => {
    if (selectedBrand !== 'ALL' && bike.brand !== selectedBrand) return false;
    if (selectedCategory !== 'ALL' && bike.category !== selectedCategory) return false;
    if (onlyInStock && bike.inStockCount <= 0) return false;

    const rawRupees = Number(bike.exShowroomPaise / 100n);
    if (selectedBudget === 'UNDER_1L' && rawRupees >= 100000) return false;
    if (selectedBudget === '1L_2L' && (rawRupees < 100000 || rawRupees > 200000)) return false;
    if (selectedBudget === '2L_3L' && (rawRupees < 200000 || rawRupees > 300000)) return false;
    if (selectedBudget === 'ABOVE_3L' && rawRupees <= 300000) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = `${bike.brand} ${bike.model} ${bike.variant}`.toLowerCase();
      if (!matchName.includes(q)) return false;
    }
    return true;
  });

  const handleAddToCart = (e: React.MouseEvent, bike: Motorcycle) => {
    e.stopPropagation();
    cartStore.addBikeBooking(bike, 1000000n, bike.availableColors[0]?.name || 'Standard');
    setAddedBikeId(bike.id);
    setTimeout(() => setAddedBikeId(null), 2000);
  };

  return (
    <div className="space-y-8" id="catalogue-section">
      {/* Controls & Filter Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-amber-500">Premium Machine Selection</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">BikeWale / BikeDekho Style Comparison</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Digital Showroom Catalogue
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select any motorcycle below to view live On-Road Thane (MH-04) pricing and detailed specifications.
            </p>
          </div>

          {/* Action buttons & Search box */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenCsvUpload && (
              <button
                type="button"
                onClick={onOpenCsvUpload}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all shadow-sm"
                title="Upload motorcycle spreadsheet to load new bikes into the showroom"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload CSV</span>
              </button>
            )}

            {onOpenCompare && (
              <button
                type="button"
                onClick={() => onOpenCompare()}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all shadow-sm ${
                  compareBikeIds.length > 0
                    ? 'border-amber-400 bg-amber-500 text-slate-950'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-600'
                }`}
                title="Open side-by-side specification comparison"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare {compareBikeIds.length > 0 ? `(${compareBikeIds.length})` : ''}</span>
              </button>
            )}

            <div className="relative min-w-[220px] sm:min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Hunter, Duke, Speed 400..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {/* Brand tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedBrand === brand
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {brand === 'ALL' ? 'All Brands' : brand}
              </button>
            ))}
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'All Types' : cat}
              </button>
            ))}
          </div>

          {/* Budget tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80">
            {budgets.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBudget(b.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedBudget === b.id
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* In stock toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300 ml-auto sm:ml-0">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 focus:ring-offset-0 h-4 w-4"
            />
            <span>Show Only Ready Floor Units</span>
          </label>
        </div>
      </div>

      {/* Grid of Bikes */}
      {filteredBikes.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No motorcycles match your filter</h3>
          <p className="text-xs text-slate-400">Try clearing filters or search query to view all available machines.</p>
          <button
            onClick={() => {
              setSelectedBrand('ALL');
              setSelectedCategory('ALL');
              setSearchQuery('');
              setOnlyInStock(false);
            }}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBikes.map((bike) => {
            const onRoadPaise =
              bike.exShowroomPaise + bike.rtoTaxPaise + bike.insurancePaise + bike.handlingPaise;
            const approxEmi = Math.round(((Number(onRoadPaise / 100n) * 0.75) / 36) * 1.09);
            const isSelected = selectedBikeId === bike.id;

            return (
              <div
                key={bike.id}
                onClick={() => onSelectBike(bike)}
                className={`group flex flex-col justify-between rounded-3xl border p-4 sm:p-5 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-slate-900/95 shadow-2xl shadow-amber-500/10 ring-2 ring-amber-500/30'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl'
                }`}
              >
                <div>
                  {/* Image container with Click-to-Zoom */}
                  <div
                    onClick={(e) => {
                      if (onZoomBike) {
                        e.stopPropagation();
                        onZoomBike(bike);
                      }
                    }}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950 group/img"
                  >
                    <img
                      key={bike.selectedColor || 'default'}
                      src={getColorBikeImage(bike, bike.selectedColor)}
                      alt={`${bike.brand} ${bike.model}`}
                      className="h-full w-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Zoom icon badge */}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-lg bg-slate-900/80 backdrop-blur-md px-2 py-1 text-[10px] font-semibold text-slate-300 border border-slate-700 hover:text-white">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Click to Zoom & Specs</span>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      {bike.inStockCount > 0 ? (
                        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{bike.inStockCount} Ready in Khopat</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-lg bg-rose-950/80 backdrop-blur-md border border-rose-500/30 px-2.5 py-1 text-[11px] font-semibold text-rose-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          <span>Booking Open (10 Days)</span>
                        </div>
                      )}
                    </div>

                    {bike.isUsed ? (
                      <div className="absolute top-2.5 right-2.5 rounded-lg bg-amber-500 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950">
                        Certified Pre-Owned · {bike.year}
                      </div>
                    ) : isSelected ? (
                      <div className="absolute top-2.5 right-2.5 rounded-lg bg-amber-500 text-slate-950 px-2 py-0.5 text-[10px] font-extrabold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Active Selection</span>
                      </div>
                    ) : null}

                    {/* Odometer for used bikes */}
                    {bike.isUsed && bike.odometerKm && (
                      <div className="absolute bottom-2.5 left-2.5 text-[11px] text-amber-400 font-bold bg-slate-950/90 px-2 py-0.5 rounded">
                        {bike.odometerKm.toLocaleString('en-IN')} KM Verified
                      </div>
                    )}
                  </div>

                  {/* Market Price Below Every Bike Picture */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-400">Market Ex-Showroom</div>
                      <div className="font-bold text-white tabular-nums">{formatInr(bike.exShowroomPaise)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-semibold text-amber-400">On-Road Thane (MH-04)</div>
                      <div className="font-extrabold text-amber-400 tabular-nums">{formatInr(onRoadPaise)}</div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="pt-3 space-y-2.5">
                    <div>
                      <div className="text-xs uppercase tracking-wider font-extrabold text-amber-500">
                        {bike.brand}
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {bike.model}
                      </h3>
                      <div className="text-xs text-slate-400 line-clamp-1">{bike.variant}</div>
                    </div>

                    {/* Available Factory Colours Swatch Strip */}
                    {bike.availableColors && bike.availableColors.length > 0 && (
                      <div className="flex items-center justify-between gap-1 text-[11px] pt-0.5">
                        <span className="text-[10px] text-slate-400">
                          Colour: <span className="text-amber-400 font-semibold">{bike.selectedColor || bike.availableColors[0]?.name}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          {bike.availableColors.map((c) => {
                            const isCurColor = (bike.selectedColor || bike.availableColors[0]?.name) === c.name;
                            return (
                              <button
                                key={c.name}
                                type="button"
                                title={`Switch to ${c.name}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dealershipStore.selectBikeColor(bike.id, c.name);
                                }}
                                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                                  isCurColor
                                    ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 scale-110 border-white'
                                    : 'border-white/30 hover:scale-105 opacity-80 hover:opacity-100'
                                }`}
                                style={{ backgroundColor: c.hex }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Variant Selector Chips (Base, Base Premium, Mid, Top) */}
                    {bike.variants && bike.variants.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-300">Choose Variant:</span>
                          <span className="text-amber-400 font-bold">{bike.variant}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                          {bike.variants.map((v) => {
                            const isCur = bike.selectedVariantId === v.id || bike.variant === v.name;
                            return (
                              <button
                                key={v.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dealershipStore.selectBikeVariant(bike.id, v.id);
                                }}
                                className={`px-1.5 py-1 rounded-md text-[10px] font-bold text-center truncate border transition-all ${
                                  isCur
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                                }`}
                                title={`${v.name}: ₹${Number(v.exShowroomPaise / 100n).toLocaleString('en-IN')}`}
                              >
                                {v.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quick Specs Strip */}
                    <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-center text-xs">
                      <div>
                        <div className="text-[10px] text-slate-500">Displacement</div>
                        <div className="font-bold text-slate-200">{bike.engineCc} cc</div>
                      </div>
                      <div className="border-x border-slate-800">
                        <div className="text-[10px] text-slate-500">Max Power</div>
                        <div className="font-bold text-slate-200">{bike.powerBhp} bhp</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Mileage</div>
                        <div className="font-bold text-slate-200">{bike.mileageKmpl} km/l</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span>Estimated EMI (36 Months)</span>
                      <span className="font-bold text-white">~ ₹{approxEmi.toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBike(bike);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Selected Machine' : 'Select & Calculate'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {bike.isUsed && onOpenOlxModal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOlxModal(bike);
                      }}
                      className="rounded-xl border border-emerald-500/40 bg-emerald-950/50 p-2.5 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                      title="Staff: 1-Click Post to OLX"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={(e) => handleAddToCart(e, bike)}
                    className="rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                    title="Add Booking Advance to Cart"
                  >
                    {addedBikeId === bike.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </button>

                  {onToggleCompareBike && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompareBike(bike);
                      }}
                      className={`rounded-xl border p-2.5 transition-all ${
                        compareBikeIds.includes(bike.id)
                          ? 'border-amber-400 bg-amber-500 text-slate-950 shadow-md font-bold'
                          : 'border-slate-700 bg-slate-950 text-slate-300 hover:text-amber-400 hover:border-amber-500/50'
                      }`}
                      title={compareBikeIds.includes(bike.id) ? 'Remove from compare' : 'Add to compare'}
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookTestRide(bike);
                    }}
                    className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2.5 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                  >
                    Test Ride
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Quick Comparison Dock */}
      {compareBikeIds.length > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl rounded-2xl border border-amber-500/40 bg-[#0B0F0D]/95 backdrop-blur-xl p-3 sm:p-4 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Comparing {compareBikeIds.length} of 2 Bikes
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  {compareBikeIds.length === 1 ? 'Select 1 more' : 'Ready for side-by-side'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {compareBikeIds
                  .map((id) => {
                    const b = bikes.find((item) => item.id === id);
                    return b ? `${b.brand} ${b.model}` : '';
                  })
                  .filter(Boolean)
                  .join(' vs ')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onClearCompare && (
              <button
                type="button"
                onClick={onClearCompare}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 text-xs"
                title="Clear comparison"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenCompare?.()}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 active:scale-95 transition-all whitespace-nowrap"
            >
              <span>Compare Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
