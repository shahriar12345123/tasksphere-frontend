import React, { useState } from 'react';
import { ArrowLeft, Users, Copy, Check, Share2, DollarSign, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const Referrals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://taskveroo.pro/register?ref=${user.username}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#12072b]/80 border border-purple-600/30 rounded-2xl p-3.5 backdrop-blur-xl">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-purple-900/40 text-purple-200 hover:text-white border border-purple-700/40"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-white">Referral Program</h2>
          <p className="text-[11px] text-purple-300/70">Earn $0.40 USD per verified active referral</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Program Banner */}
      <div className="bg-gradient-to-r from-purple-900/80 via-pink-900/60 to-indigo-900/80 border border-pink-500/40 rounded-2xl p-4 text-center space-y-1 shadow-lg">
        <div className="flex items-center justify-center space-x-1 text-yellow-400 text-xs font-black uppercase tracking-wider">
          <Zap className="w-4 h-4 fill-yellow-400" />
          <span>Active Referral Reward</span>
        </div>
        <h3 className="text-xl font-black text-white">Earn <span className="text-emerald-400">$0.40 USD</span> per Verified Referral</h3>
        <p className="text-[11px] text-purple-200/80 leading-relaxed max-w-xs mx-auto pt-0.5">
          When your referred friend activates their account with $1.00 USDT, you instantly get <strong className="text-emerald-300">$0.40 USD</strong> added to your balance, plus 10% commission on their task earnings!
        </p>
      </div>

      {/* Referral Link Box */}
      <div className="bg-[#12072b]/80 border border-purple-600/30 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-3 text-center">
        <div className="w-12 h-12 bg-pink-500/20 border border-pink-500/40 rounded-2xl flex items-center justify-center text-pink-400 mx-auto">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">Your Personal Referral Link</h3>
        <p className="text-xs text-purple-200/70">Share your unique link below or give your code <strong className="text-pink-400">"{user.username}"</strong> to your friends.</p>

        <div className="flex items-center bg-purple-950/80 border border-purple-700/50 p-2 rounded-xl">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="bg-transparent text-xs font-mono text-pink-300 px-2 flex-1 outline-none truncate"
          />
          <button
            onClick={copyLink}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 hover:brightness-110"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#12072b]/80 border border-purple-600/30 rounded-2xl p-4 text-center">
          <div className="text-xs text-purple-300">Active Verified Referrals</div>
          <div className="text-2xl font-black text-white mt-1">{user.referralsCount} Friends</div>
        </div>
        <div className="bg-[#12072b]/80 border border-purple-600/30 rounded-2xl p-4 text-center">
          <div className="text-xs text-purple-300">Total Referral Earnings</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">${user.referralCommission.toFixed(2)} USD</div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
