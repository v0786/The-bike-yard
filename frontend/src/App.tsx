import React, { useState, useEffect } from 'react';
import { dealershipStore, DealershipState } from './services/dealershipStore';
import { Motorcycle } from './types';
import { UserProfile, DEMO_USERS } from './lib/rbac';
import { Navbar } from './components/Navbar';
import { ShowroomHero } from './components/ShowroomHero';
import { TrendingMarquee } from './components/TrendingMarquee';
import { BikeListing } from './components/BikeListing';
import { PersistentOnRoadBar } from './components/PersistentOnRoadBar';
import { FinanceEmiSection } from './components/FinanceEmiSection';
import { BikeDetailModal } from './components/BikeDetailModal';
import { BikeZoomSpecsModal } from './components/BikeZoomSpecsModal';
import { TestRideModal } from './components/TestRideModal';
import { CartDrawer } from './components/CartDrawer';
import { LegalPagesModal } from './components/LegalPagesModal';
import { LegalPagesView } from './components/LegalPagesView';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { CsvUploadModal } from './components/CsvUploadModal';
import { BikeCompareModal } from './components/BikeCompareModal';
import { OlxPostingModal } from './components/OlxPostingModal';
import { StaffLoginPage } from './components/StaffLoginPage';
import { ApplicationsHub } from './components/ApplicationsHub';
import { AdminDashboard } from './components/AdminDashboard';
import { StaffPortal } from './components/StaffPortal';
import { GroundedChatbot } from './components/GroundedChatbot';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { FAQS } from './data/dealershipData';
import { ChevronDown, ShieldCheck, Flame, Sparkles } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<DealershipState>(dealershipStore.getState());
  const [activeView, setActiveView] = useState<'showroom' | 'admin' | 'staff' | 'login' | 'legal'>('showroom');
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [leadTargetBike, setLeadTargetBike] = useState<Motorcycle | null>(null);

  // Authentication State for Staff & Dealership Management
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Vehicle Selection & Modal States
  const [selectedBike, setSelectedBike] = useState<Motorcycle | null>(state.bikes[0] || null);
  const [detailBike, setDetailBike] = useState<Motorcycle | null>(null);
  const [zoomBike, setZoomBike] = useState<Motorcycle | null>(null);
  const [testRideBike, setTestRideBike] = useState<Motorcycle | null>(null);
  const [olxTargetBike, setOlxTargetBike] = useState<Motorcycle | null>(null);

  // UI Modal Toggles
  const [isTestRideOpen, setIsTestRideOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms'>('privacy');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState<boolean>(false);
  const [isOlxModalOpen, setIsOlxModalOpen] = useState<boolean>(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Compare State
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareBikeIds, setCompareBikeIds] = useState<string[]>([]);
  const [compareBikeA, setCompareBikeA] = useState<Motorcycle | null>(null);
  const [compareBikeB, setCompareBikeB] = useState<Motorcycle | null>(null);

  const handleToggleCompareBike = (bike: Motorcycle) => {
    setCompareBikeIds((prev) => {
      if (prev.includes(bike.id)) {
        return prev.filter((id) => id !== bike.id);
      }
      if (prev.length >= 2) {
        const updated = [prev[0]!, bike.id];
        const first = state.bikes.find((b) => b.id === prev[0]) || null;
        setCompareBikeA(first);
        setCompareBikeB(bike);
        setIsCompareOpen(true);
        return updated;
      }
      const updated = [...prev, bike.id];
      if (updated.length === 2) {
        const first = state.bikes.find((b) => b.id === updated[0]) || null;
        setCompareBikeA(first);
        setCompareBikeB(bike);
        setIsCompareOpen(true);
      }
      return updated;
    });
  };

  const handleOpenCompare = (bikeA?: Motorcycle, bikeB?: Motorcycle) => {
    if (bikeA) setCompareBikeA(bikeA);
    if (bikeB) setCompareBikeB(bikeB);

    if (!bikeA && !bikeB) {
      if (compareBikeIds.length >= 2) {
        const bA = state.bikes.find((b) => b.id === compareBikeIds[0]) || null;
        const bB = state.bikes.find((b) => b.id === compareBikeIds[1]) || null;
        setCompareBikeA(bA);
        setCompareBikeB(bB);
      } else if (compareBikeIds.length === 1) {
        const bA = state.bikes.find((b) => b.id === compareBikeIds[0]) || null;
        const bB = state.bikes.find((b) => b.id !== compareBikeIds[0]) || null;
        setCompareBikeA(bA);
        setCompareBikeB(bB);
      } else {
        setCompareBikeA(state.bikes[0] || null);
        setCompareBikeB(state.bikes[1] || state.bikes[0] || null);
      }
    }
    setIsCompareOpen(true);
  };

  const handleClearCompare = () => {
    setCompareBikeIds([]);
    setCompareBikeA(null);
    setCompareBikeB(null);
  };

  // Subscribe to real-time store updates
  useEffect(() => {
    const unsubscribe = dealershipStore.subscribe(() => {
      const freshState = { ...dealershipStore.getState() };
      setState(freshState);
      // Keep selectedBike in sync with updated variant or stock counts
      if (selectedBike) {
        const updated = freshState.bikes.find((b) => b.id === selectedBike.id);
        if (updated) setSelectedBike(updated);
      }
    });
    return () => unsubscribe();
  }, [selectedBike?.id]);

  const totalInStock = state.stockUnits.filter((u) => u.status === 'IN_STOCK').length;
  const newBikes = state.bikes.filter((b) => !b.isUsed);
  const usedBikes = state.bikes.filter((b) => b.isUsed);

  const handleStaffLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'SALES_EXEC' || user.role === 'RTO_STAFF') {
      setActiveView('staff');
    } else {
      setActiveView('admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStaffLogout = () => {
    setCurrentUser(null);
    setActiveView('showroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentActiveBike = selectedBike || state.bikes[0] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-400">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        onViewChange={(v) => {
          if ((v === 'admin' || v === 'staff') && !currentUser) {
            setActiveView('login');
          } else {
            setActiveView(v);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTestRideModal={() => {
          setTestRideBike(currentActiveBike);
          setIsTestRideOpen(true);
        }}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLeadModal={() => {
          setLeadTargetBike(currentActiveBike);
          setIsLeadModalOpen(true);
        }}
        onOpenCompare={() => handleOpenCompare()}
        compareCount={compareBikeIds.length}
        onOpenCsvUpload={() => setIsCsvModalOpen(true)}
        currentUser={currentUser}
        onLogout={handleStaffLogout}
      />

      {/* Main Body */}
      <main className="flex-1">
        {/* PUBLIC DIGITAL SHOWROOM — BIKEWALE STYLE EXPLORATION */}
        {activeView === 'showroom' && (
          <div className="space-y-12 sm:space-y-16 pb-24 md:pb-28">
            {/* Showroom Hero Banner */}
            <ShowroomHero
              inStockTotal={totalInStock}
              onExploreClick={() => {
                const el = document.getElementById('catalogue-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onTestRideClick={() => {
                setTestRideBike(currentActiveBike);
                setIsTestRideOpen(true);
              }}
              onEmiClick={() => {
                const el = document.getElementById('emi-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Trending Bikes Right-to-Left Scrolling Marquee */}
            <TrendingMarquee
              bikes={state.bikes}
              onSelectBike={(b) => setSelectedBike(b)}
              selectedBikeId={selectedBike?.id}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
              {/* New Motorcycle Catalogue */}
              <BikeListing
                bikes={newBikes}
                onSelectBike={(b) => setSelectedBike(b)}
                onBookTestRide={(b) => {
                  setTestRideBike(b);
                  setIsTestRideOpen(true);
                }}
                onZoomBike={(b) => setZoomBike(b)}
                onOpenCsvUpload={() => setIsCsvModalOpen(true)}
                onOpenCompare={handleOpenCompare}
                compareBikeIds={compareBikeIds}
                onToggleCompareBike={handleToggleCompareBike}
                onClearCompare={handleClearCompare}
                selectedBikeId={selectedBike?.id}
              />

              {/* Certified Pre-Owned Section */}
              <div className="space-y-6" id="used-bikes-section">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-extrabold text-amber-500 tracking-wider">
                        Thane RTO Certified
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-emerald-400 font-semibold">
                        45-Point Inspection Passed
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Certified Pre-Owned Motorcycles & Scooters
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentUser && (
                      <button
                        onClick={() => {
                          setOlxTargetBike(usedBikes[0] || null);
                          setIsOlxModalOpen(true);
                        }}
                        className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors shadow-sm"
                      >
                        Staff: 1-Click Post to OLX
                      </button>
                    )}
                    <span className="text-xs text-slate-400">
                      6-Month Warranty · Clean MH-04 Transfer
                    </span>
                  </div>
                </div>

                <BikeListing
                  bikes={usedBikes}
                  onSelectBike={(b) => setSelectedBike(b)}
                  onBookTestRide={(b) => {
                    setTestRideBike(b);
                    setIsTestRideOpen(true);
                  }}
                  onZoomBike={(b) => setZoomBike(b)}
                  onOpenOlxModal={(b) => {
                    setOlxTargetBike(b);
                    setIsOlxModalOpen(true);
                  }}
                  onOpenCsvUpload={() => setIsCsvModalOpen(true)}
                  onOpenCompare={handleOpenCompare}
                  compareBikeIds={compareBikeIds}
                  onToggleCompareBike={handleToggleCompareBike}
                  onClearCompare={handleClearCompare}
                  selectedBikeId={selectedBike?.id}
                />
              </div>

              {/* 10 Institutional Finance Partners & Live EMI Calculator */}
              {currentActiveBike && (
                <FinanceEmiSection
                  selectedBike={currentActiveBike}
                  onApplySuccess={(lead) => {
                    // Handled internally in FinanceEmiSection; lead added to call queue
                  }}
                />
              )}

              {/* Finance, Insurance & RTO Hub */}
              <div id="applications-hub">
                <ApplicationsHub />
              </div>

              {/* Frequently Asked Questions */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Transparent answers regarding booking advance, Maharashtra RTO taxes, and Khopat delivery processes.
                  </p>
                </div>

                <div className="space-y-3">
                  {FAQS.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)
                        }
                        className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                            expandedFaqIndex === idx ? 'rotate-180 text-amber-400' : ''
                          }`}
                        />
                      </button>
                      {expandedFaqIndex === idx && (
                        <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Persistent On-Road Price Bar Docked at Bottom */}
            {currentActiveBike && (
              <PersistentOnRoadBar
                selectedBike={currentActiveBike}
                bikes={state.bikes}
                onSelectBike={(b) => setSelectedBike(b)}
                onOpenBooking={(b) => setDetailBike(b)}
                onOpenTestRide={(b) => {
                  setTestRideBike(b);
                  setIsTestRideOpen(true);
                }}
                onOpenSpecs={(b) => setZoomBike(b)}
              />
            )}
          </div>
        )}

        {/* STAFF & OWNER LOGIN PORTAL */}
        {activeView === 'login' && (
          <StaffLoginPage
            onLoginSuccess={handleStaffLogin}
            onBackToShowroom={() => setActiveView('showroom')}
          />
        )}

        {/* ADMIN DASHBOARD (Protected by Staff/Owner Login) */}
        {activeView === 'admin' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
            <AdminDashboard
              state={state}
              onOpenCsvUpload={() => setIsCsvModalOpen(true)}
              onOpenOlxModal={(b) => {
                setOlxTargetBike(b || usedBikes[0] || null);
                setIsOlxModalOpen(true);
              }}
              currentUser={currentUser || undefined}
              onLogout={handleStaffLogout}
            />
          </div>
        )}

        {/* STAFF OPERATIONS PORTAL */}
        {activeView === 'staff' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
            <StaffPortal
              state={state}
              onOpenCsvUpload={() => setIsCsvModalOpen(true)}
              onOpenOlxModal={(b) => {
                setOlxTargetBike(b || usedBikes[0] || null);
                setIsOlxModalOpen(true);
              }}
              currentUser={currentUser}
              onLogout={handleStaffLogout}
            />
          </div>
        )}

        {/* DEDICATED FULL-PAGE PRIVACY POLICY & TERMS VIEW */}
        {activeView === 'legal' && (
          <LegalPagesView
            initialTab={legalTab}
            onBackToShowroom={() => {
              setActiveView('showroom');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* MODALS & LIGHTBOXES */}

      {/* Priority Callback & On-Road Quote Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        selectedBike={leadTargetBike || selectedBike}
        bikes={state.bikes}
      />

      {/* 360° Zoom & Multi-Tab Technical Specifications Lightbox */}
      {zoomBike && (
        <BikeZoomSpecsModal
          bike={zoomBike}
          onClose={() => setZoomBike(null)}
          onBookTestRide={(b) => {
            setZoomBike(null);
            setTestRideBike(b);
            setIsTestRideOpen(true);
          }}
          onInstantBooking={(b) => {
            setZoomBike(null);
            setDetailBike(b);
          }}
        />
      )}

      {/* Bike Details & Booking Modal */}
      {detailBike && (
        <BikeDetailModal
          bike={detailBike}
          onClose={() => setDetailBike(null)}
          onOpenTestRide={(b) => {
            setDetailBike(null);
            setTestRideBike(b);
            setIsTestRideOpen(true);
          }}
        />
      )}

      {/* Test Ride Scheduler */}
      {isTestRideOpen && (
        <TestRideModal
          bike={testRideBike || currentActiveBike}
          bikes={state.bikes}
          onClose={() => setIsTestRideOpen(false)}
        />
      )}

      {/* Grounded Anti-Hallucination AI Showroom Desk */}
      <GroundedChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Shopping / Booking Advance Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Privacy Policy & Terms Legal Modal */}
      <LegalPagesModal
        isOpen={isLegalModalOpen}
        initialTab={legalModalTab}
        onClose={() => setIsLegalModalOpen(false)}
      />

      {/* Backend Staff CSV Upload & 1,000+ Variants Sync Modal */}
      <CsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        staffName={currentUser?.name || 'Staff Operations'}
      />

      {/* Side-by-Side Motorcycle Specification Comparison Modal */}
      <BikeCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        bikes={state.bikes}
        initialBikeA={compareBikeA}
        initialBikeB={compareBikeB}
        onBookBike={(b) => {
          setIsCompareOpen(false);
          setDetailBike(b);
        }}
        onTestRideBike={(b) => {
          setIsCompareOpen(false);
          setTestRideBike(b);
          setIsTestRideOpen(true);
        }}
      />

      {/* OLX India 1-Click Second-Hand Bike Ad Publisher Modal */}
      <OlxPostingModal
        isOpen={isOlxModalOpen}
        bike={olxTargetBike}
        availableBikes={state.bikes}
        staffName={currentUser?.name || 'Suraj Patil (Sales Exec)'}
        onClose={() => setIsOlxModalOpen(false)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeView={activeView}
        onViewChange={(v) => {
          if ((v === 'admin' || v === 'staff') && !currentUser) {
            setActiveView('login');
          } else {
            setActiveView(v);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTestRideModal={() => {
          setTestRideBike(currentActiveBike);
          setIsTestRideOpen(true);
        }}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
      />

      {/* Dealership Footer with Legal Privacy/Terms Triggers */}
      <Footer
        onOpenTestRideModal={() => {
          setTestRideBike(currentActiveBike);
          setIsTestRideOpen(true);
        }}
        onOpenPrivacyModal={() => {
          setLegalModalTab('privacy');
          setIsLegalModalOpen(true);
        }}
        onOpenTermsModal={() => {
          setLegalModalTab('terms');
          setIsLegalModalOpen(true);
        }}
        onNavigateToLegal={(tab) => {
          setLegalTab(tab);
          setActiveView('legal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
