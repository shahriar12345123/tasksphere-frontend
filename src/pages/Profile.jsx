import React from 'react';
import { ArrowLeft, User, ShieldCheck, Mail, Wallet, Lock, LogOut, CheckCircle2, History, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
          <h2 className="text-lg font-bold text-white">Account Profile</h2>
          <p className="text-[11px] text-purple-300/70">Manage user credentials & settings</p>
        </div>
        <div className="w-9" />
      </div>

      {/* User Card */}
      <div className="bg-[#12072b]/80 border border-purple-600/30 rounded-3xl p-5 shadow-2xl backdrop-blur-xl text-center space-y-3">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-emerald-400 p-0.5 shadow-lg shadow-emerald-400/20"
        />
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-xl font-black text-white flex items-center justify-center space-x-1.5">
            <span>{user.username}</span>
            {user.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500/20" />
            )}
          </h3>
          <p className="text-xs text-purple-300/70 mt-0.5">{user.email}</p>
        </div>

        <div className="flex items-center justify-center space-x-2 pt-1">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center space-x-1 border ${
            user.isVerified
              ? 'bg-blue-500/20 border-blue-400/40 text-blue-400'
              : 'bg-yellow-500/20 border-yellow-400/40 text-yellow-400'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{user.isVerified ? 'Verified Account' : 'Verification Pending'}</span>
          </span>
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-[#12072b]/80 border border-purple-600/30 rounded-3xl p-4 shadow-xl backdrop-blur-xl space-y-2">
        <button
          onClick={() => navigate('/withdraw')}
          className="w-full p-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 flex items-center justify-between text-xs text-purple-200 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Payment & Payout Settings</span>
          </div>
          <span className="text-purple-400">→</span>
        </button>

        <button
          onClick={() => navigate('/referrals')}
          className="w-full p-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 flex items-center justify-between text-xs text-purple-200 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Users className="w-4 h-4 text-pink-400" />
            <span>Referral Program</span>
          </div>
          <span className="text-purple-400">→</span>
        </button>

        <button
          onClick={() => navigate('/history')}
          className="w-full p-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 flex items-center justify-between text-xs text-purple-200 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <History className="w-4 h-4 text-sky-400" />
            <span>Transaction History</span>
          </div>
          <span className="text-purple-400">→</span>
        </button>

        <button
          onClick={logout}
          className="w-full p-3 rounded-2xl bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/30 flex items-center justify-between text-xs text-pink-400 font-bold transition-colors mt-4"
        >
          <div className="flex items-center space-x-3">
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </div>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
