import React from 'react';
import { ArrowLeft, Crown, Check, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../lib/supabase';

export const Plans = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const vipPlans = [
    {
      level: 'VIP 1',
      price: 0,
      dailyTasks: 5,
      earningPerTask: 0.10,
      dailyEarnings: 0.50,
      isCurrent: user.vipLevel === 'VIP 1',
      badgeColor: 'from-gray-500 to-slate-700'
    },
    {
      level: 'VIP 2',
      price: 15,
      dailyTasks: 15,
      earningPerTask: 0.25,
      dailyEarnings: 3.75,
      isCurrent: user.vipLevel === 'VIP 2',
      badgeColor: 'from-blue-500 to-indigo-600'
    },
    {
      level: 'VIP 3',
      price: 45,
      dailyTasks: 30,
      earningPerTask: 0.40,
      dailyEarnings: 12.00,
      isCurrent: user.vipLevel === 'VIP 3',
      badgeColor: 'from-purple-500 to-pink-600'
    },
    {
      level: 'VIP PRO Gold',
      price: 100,
      dailyTasks: 50,
      earningPerTask: 0.80,
      dailyEarnings: 40.00,
      isCurrent: user.vipLevel === 'VIP PRO Gold',
      badgeColor: 'from-amber-400 to-yellow-600'
    }
  ];

  const handleUpgrade = async (plan) => {
    if (user.vipLevel === plan.level) return;

    try {
      if (user.id) {
        const res = await fetch(`${BACKEND_URL}/api/vip/upgrade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            vipLevel: plan.level,
            price: plan.price
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setUser((prev) => ({ ...prev, vipLevel: data.profile.vip_level }));
          } else {
            setUser((prev) => ({ ...prev, vipLevel: plan.level }));
          }
        } else {
          setUser((prev) => ({ ...prev, vipLevel: plan.level }));
        }
      } else {
        setUser((prev) => ({ ...prev, vipLevel: plan.level }));
      }
    } catch (err) {
      setUser((prev) => ({ ...prev, vipLevel: plan.level }));
    }

    alert(`Successfully upgraded to ${plan.level}!`);
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
          <h2 className="text-lg font-bold text-white">VIP Membership Plans</h2>
          <p className="text-[11px] text-purple-300/70">Upgrade your daily task earnings limit</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Grid of VIP Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {vipPlans.map((plan) => (
          <div
            key={plan.level}
            className={`bg-[#12072b]/80 border rounded-3xl p-5 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between ${
              plan.isCurrent
                ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                : 'border-purple-600/30 hover:border-purple-500/50'
            }`}
          >
            {plan.isCurrent && (
              <div className="absolute top-3 right-3 bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                Active Plan
              </div>
            )}

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${plan.badgeColor} flex items-center justify-center text-white shadow-md`}>
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{plan.level}</h3>
                  <div className="text-xs font-bold text-pink-400">${plan.price} USD</div>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-purple-200/80 mb-5">
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span><strong>{plan.dailyTasks}</strong> Micro Tasks / day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Earning per task: <strong>${plan.earningPerTask.toFixed(2)}</strong></span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Est. Daily Income: <strong className="text-emerald-300">${plan.dailyEarnings.toFixed(2)}</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgrade(plan)}
              disabled={plan.isCurrent}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                plan.isCurrent
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:brightness-110 active:scale-95 shadow-md shadow-purple-500/20'
              }`}
            >
              {plan.isCurrent ? 'Current Active Package' : `Upgrade for $${plan.price} USD`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
