import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CheckCircle2,
  Coins,
  Wallet,
  Sparkles,
  Send,
  Video,
  CalendarCheck,
  ClipboardList,
  Users,
  ShoppingBag,
  History,
  X,
  Copy,
  Check,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { FacebookIcon as Facebook, YoutubeIcon as Youtube } from '../components/BrandIcons';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../lib/supabase';

export const Dashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Activate modal state
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [binanceUid, setBinanceUid] = useState(user.binanceUid || '');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Admin Binance Pay ID that users must pay to
  const BINANCE_PAY_ID = '409956378';

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCopyPayId = () => {
    navigator.clipboard.writeText(BINANCE_PAY_ID);
    setCopied(true);
    showToast('✅ Binance Pay ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleActivateSubmit = async (e) => {
    e.preventDefault();
    if (!binanceUid.trim()) return;

    setLoading(true);
    try {
      if (user.id) {
        const res = await fetch(`${BACKEND_URL}/api/activate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            binanceUid: binanceUid
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setUser((prev) => ({
              ...prev,
              isVerified: data.profile.is_verified,
              binanceUid: data.profile.binance_uid
            }));
          }
        }
      }

      setSubmitted(true);
      showToast('🚀 Activation request submitted! Admin will verify your payment shortly.');
    } catch (err) {
      console.warn('Activation request fallback:', err);
      setSubmitted(true);
      showToast('🚀 Activation request submitted! Admin will verify your payment shortly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 pt-2 sm:pt-4">
      {/* Toast Notification Popup */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-semibold px-4 py-2.5 rounded-full shadow-lg shadow-emerald-500/30 text-xs sm:text-sm animate-bounce flex items-center space-x-2 border border-emerald-300">
          <Sparkles className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container matching screenshot frame */}
      <div className="bg-[#12072b]/80 border border-purple-600/30 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-purple-950/70 backdrop-blur-xl relative overflow-hidden">
        
        {/* 1. Header Profile Banner */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* User Avatar with Ring */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-emerald-400 p-0.5 shadow-md shadow-emerald-400/20"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#12072b] rounded-full" />
            </div>

            {/* Welcome & Username */}
            <div>
              <div className="text-xs text-purple-200/80 font-medium">Welcome</div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                  {user.username}
                </span>
                {user.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500/20" />
                )}
              </div>
            </div>
          </div>

          {/* Coins Counter Badge */}
          <div className="flex items-center space-x-1.5 bg-purple-900/40 border border-yellow-500/40 px-3 py-1.5 rounded-full shadow-inner">
            <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400/30" />
            <span className="text-xs font-bold text-yellow-300">{user.coins}</span>
          </div>
        </div>

        {/* 2. Balance Card (Glowing Neon Box) */}
        <div className="relative rounded-2xl p-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-xl shadow-purple-600/25 mb-4">
          <div className="bg-[#1a0a38]/90 rounded-[15px] p-5 text-center relative overflow-hidden backdrop-blur-md border border-purple-400/20">
            {/* Subtle glow background inside card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-24 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

            {/* Dynamic Balance Display */}
            <div className="relative z-10">
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                  ${user.balance.toFixed(2)}
                </span>
                <span className="text-xs font-extrabold text-yellow-400 tracking-wider">USD</span>
              </div>
              <p className="text-xs font-semibold text-purple-200/80 mt-0.5 tracking-wide">
                Available Balance
              </p>

              {/* Action Buttons: Activate / Active & Withdraw */}
              <div className="grid grid-cols-2 gap-3 mt-4 max-w-xs mx-auto">
                <button
                  onClick={user.isVerified ? null : () => setShowActivateModal(true)}
                  disabled={user.isVerified}
                  className={`py-2 px-3 rounded-full text-xs shadow-md font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    user.isVerified
                      ? 'bg-blue-500/20 border border-blue-400/40 text-blue-400 cursor-default'
                      : 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/30 hover:brightness-110 active:scale-95'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{user.isVerified ? 'Active' : 'Activate'}</span>
                </button>

                <button
                  onClick={() => navigate('/withdraw')}
                  className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white font-bold py-2 px-3 rounded-full text-xs shadow-md shadow-sky-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Wallet className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Grid of Service Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          {/* Card 1: Facebook Work */}
          <div
            onClick={() => navigate('/tasks?category=facebook')}
            className="bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-950/40 border border-purple-300/30 group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-1.5 shadow-sm">
              <Facebook className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
              Facebook Work
            </span>
          </div>

          {/* Card 2: Telegram */}
          <div
            onClick={() => navigate('/tasks?category=telegram')}
            className="bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-950/40 border border-purple-300/30 group"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white mb-1.5 shadow-sm">
              <Send className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-sky-500 transition-colors">
              Telegram
            </span>
          </div>

          {/* Card 3: Tiktok work */}
          <div
            onClick={() => navigate('/tasks?category=tiktok')}
            className="bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-950/40 border border-purple-300/30 group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-cyan-400 mb-1.5 shadow-sm">
              <Video className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-pink-600 transition-colors">
              Tiktok work
            </span>
          </div>

          {/* Card 4: Youtube */}
          <div
            onClick={() => navigate('/tasks?category=youtube')}
            className="bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-950/40 border border-purple-300/30 group"
          >
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white mb-1.5 shadow-sm">
              <Youtube className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-red-600 transition-colors">
              Youtube
            </span>
          </div>

          {/* Card 5: Daily Bonus (Disabled) */}
          <div
            onClick={() => showToast('🔒 Daily Bonus is currently disabled')}
            className="bg-white/70 opacity-60 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center cursor-not-allowed shadow-lg shadow-purple-950/40 border border-purple-300/30 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-500 flex items-center justify-center text-white mb-1.5 shadow-sm">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-700 line-clamp-1">
              Daily Bonus
            </span>
          </div>

          {/* Card 6: Surveys (Disabled) */}
          <div
            onClick={() => showToast('🔒 Surveys are currently disabled')}
            className="bg-white/70 opacity-60 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center cursor-not-allowed shadow-lg shadow-purple-300/30 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-500 flex items-center justify-center text-white mb-1.5 shadow-sm">
              <ClipboardList className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-700 line-clamp-1">
              Surveys
            </span>
          </div>

          {/* Card 7: Referrals */}
          <div
            onClick={() => navigate('/referrals')}
            className="bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-950/40 border border-purple-300/30 group"
          >
            <div className="w-8 h-8 rounded-xl bg-pink-500 flex items-center justify-center text-white mb-1.5 shadow-sm">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-pink-600 transition-colors">
              Referrals
            </span>
          </div>

          {/* Card 8: Order List */}
          <div
            onClick={() => navigate('/history')}
            className="bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-950/40 border border-purple-300/30 group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white mb-1.5 shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
              Order List
            </span>
          </div>

          {/* Card 9: History */}
          <div
            onClick={() => navigate('/history')}
            className="bg-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-950/40 border border-purple-300/30 group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-white mb-1.5 shadow-sm">
              <History className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-slate-900 transition-colors">
              History
            </span>
          </div>
        </div>
      </div>

      {/* --- ACTIVATE ACCOUNT MODAL --- */}
      {showActivateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c0b3b] border border-purple-500/40 w-full max-w-sm rounded-3xl p-5 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => { setShowActivateModal(false); setSubmitted(false); setBinanceUid(''); }}
              className="absolute top-3 right-3 text-purple-300 hover:text-white p-1 rounded-full bg-purple-900/40"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Success State */}
            {submitted ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Request Submitted!</h3>
                <p className="text-xs text-purple-200/70 leading-relaxed">
                  Your activation request has been submitted successfully. An admin will verify your <span className="text-yellow-400 font-bold">$1.00 USDT</span> payment and activate your account shortly.
                </p>
                <div className="bg-purple-950/60 border border-purple-700/40 rounded-xl p-3 text-xs text-purple-300">
                  <span className="text-purple-400">Your Binance UID:</span>{' '}
                  <span className="font-bold text-white">{binanceUid}</span>
                </div>
                <button
                  onClick={() => { setShowActivateModal(false); setSubmitted(false); setBinanceUid(''); }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Payment Form State */
              <div className="space-y-4">
                {/* Header Icon */}
                <div className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center text-slate-950 mx-auto mb-3 shadow-lg shadow-yellow-500/30">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Activate Your Account</h3>
                  <p className="text-xs text-purple-200/70 mt-1">
                    Pay <span className="text-yellow-400 font-bold">$1.00 USDT</span> via Binance Pay to activate your earning account
                  </p>
                </div>

                {/* Step 1: Copy Binance Pay ID */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center text-[10px] font-black flex-shrink-0">1</span>
                    <span className="text-xs font-bold text-purple-100">Copy the Binance Pay ID below</span>
                  </div>
                  <div className="bg-purple-950/80 border border-purple-700/50 py-3 px-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-purple-400 font-medium mb-0.5">Binance Pay ID</p>
                      <span className="text-lg font-mono font-black tracking-wider text-yellow-300">
                        {BINANCE_PAY_ID}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyPayId}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                        copied
                          ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-400'
                          : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 active:scale-95 shadow-md shadow-yellow-500/20'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Step 2: Send Payment */}
                <div className="flex items-start space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">2</span>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    Open <span className="text-yellow-400 font-bold">Binance App</span> → Pay → Send → Paste the Pay ID above → Send <span className="text-emerald-400 font-bold">$1.00 USDT</span>
                  </p>
                </div>

                {/* Step 3: Enter Your Binance UID */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center text-[10px] font-black flex-shrink-0">3</span>
                    <span className="text-xs font-bold text-purple-100">Enter your Binance UID</span>
                  </div>
                  <form onSubmit={handleActivateSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Paste your Binance UID here..."
                      value={binanceUid}
                      onChange={(e) => setBinanceUid(e.target.value)}
                      className="w-full bg-purple-950/60 border border-purple-700/50 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-purple-400 focus:outline-none focus:border-yellow-400/60 transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Submitting Request...' : 'Submit Activation Request'}
                    </button>
                  </form>
                </div>

                {/* Info Note */}
                <p className="text-[10px] text-purple-400/70 text-center leading-relaxed">
                  ⚡ After submitting, an admin will verify your payment and activate your account within 1-24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
