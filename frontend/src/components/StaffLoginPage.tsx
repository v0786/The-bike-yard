import React, { useState } from 'react';
import { DEMO_USERS, UserProfile, ROLE_CONFIGS } from '../lib/rbac';
import {
  Lock,
  Bike,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  ChevronRight,
  Shield,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

interface StaffLoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBackToShowroom: () => void;
}

export const StaffLoginPage: React.FC<StaffLoginPageProps> = ({
  onLoginSuccess,
  onBackToShowroom,
}) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile>(DEMO_USERS[0]!); // Default Super Admin
  const [emailInput, setEmailInput] = useState<string>(DEMO_USERS[0]!.email);
  const [passwordInput, setPasswordInput] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginMode, setLoginMode] = useState<'quick' | 'credential'>('quick');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleQuickLogin = (user: UserProfile) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLoginSuccess(user);
    }, 400);
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const user = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === emailInput.trim().toLowerCase()
    );

    if (!user) {
      setErrorMsg('No staff account found with this email. Please check credentials.');
      return;
    }

    if (passwordInput.length < 4) {
      setErrorMsg('Please enter your dealership portal password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onLoginSuccess(user);
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-10 space-y-8">
        {/* Dealership Internal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-md shadow-amber-500/10">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  The Bike Yard Internal
                </h2>
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Staff Only
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thane Showroom & Floor Operations Portal · Khopat (MH-04)
              </p>
            </div>
          </div>

          <button
            onClick={onBackToShowroom}
            className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 self-start sm:self-center transition-colors"
          >
            <span>Return to Public Showroom</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Toggle: 1-Click Quick Access vs Password Sign-in */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setLoginMode('quick');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              loginMode === 'quick'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Click Staff Persona Sign-in
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('credential');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              loginMode === 'credential'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Official Email & Password
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Role Personas Grid */}
        {loginMode === 'quick' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Select your role profile to access your designated operations dashboard:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_USERS.map((user) => {
                const config = ROLE_CONFIGS[user.role];
                return (
                  <button
                    key={user.id}
                    onClick={() => handleQuickLogin(user)}
                    disabled={isSubmitting}
                    className="group flex flex-col justify-between text-left p-4 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-amber-500/60 hover:bg-slate-950 transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-extrabold text-xs">
                          {user.avatarText}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-amber-400">
                          {config.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{user.designation}</p>
                      <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">
                        {config.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span>Launch Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Official Email / Password Sign-in */}
        {loginMode === 'credential' && (
          <form onSubmit={handleCredentialSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Staff Corporate Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="suraj.patil@thebikeyard.in"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 pr-10 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dealership Staff Portal'}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 text-center pt-2">
              Default password for all internal profiles is <code className="text-amber-400">password123</code>
            </div>
          </form>
        )}

        {/* Security & Regulatory footer */}
        <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted Internal Dealership Network</span>
          </div>
          <div>GSTIN: 27AABCT9981K1ZT · Central Thane RTO</div>
        </div>
      </div>
    </div>
  );
};
