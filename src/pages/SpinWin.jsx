import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../lib/supabase';

export const SpinWin = () => {
  const navigate = useNavigate();
  const { user, updateBalance, addCoins, setUser } = useAuth();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [prizeMsg, setPrizeMsg] = useState('');

  const prizes = [
    { label: '$0.50 USD', value: 0.50, type: 'cash', color: '#ec4899' },
    { label: '50 Coins', value: 50, type: 'coin', color: '#a855f7' },
    { label: '$1.00 USD', value: 1.00, type: 'cash', color: '#3b82f6' },
    { label: '10 Coins', value: 10, type: 'coin', color: '#10b981' },
    { label: '$0.20 USD', value: 0.20, type: 'cash', color: '#f59e0b' },
    { label: '100 Coins', value: 100, type: 'coin', color: '#6366f1' },
  ];

  const handleSpin = () => {
    if (spinning || spinsLeft <= 0) return;

    setSpinning(true);
    setPrizeMsg('');

    // Pick random prize
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[prizeIndex];

    // Calculate rotation angle
    const sliceAngle = 360 / prizes.length;
    const targetAngle = 360 * 5 + (360 - (prizeIndex * sliceAngle + sliceAngle / 2));
    const newRotation = rotation + targetAngle;
    setRotation(newRotation);

    setTimeout(async () => {
      setSpinning(false);
      setSpinsLeft((prev) => prev - 1);

      try {
        if (user.id) {
          const res = await fetch(`${BACKEND_URL}/api/spin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              prize: selectedPrize
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.profile) {
              setUser((prev) => ({
                ...prev,
                balance: parseFloat(data.profile.balance || 0),
                coins: parseInt(data.profile.coins || 0)
              }));
            } else {
              if (selectedPrize.type === 'cash') updateBalance(selectedPrize.value);
              else addCoins(selectedPrize.value);
            }
          } else {
            if (selectedPrize.type === 'cash') updateBalance(selectedPrize.value);
            else addCoins(selectedPrize.value);
          }
        } else {
          if (selectedPrize.type === 'cash') updateBalance(selectedPrize.value);
          else addCoins(selectedPrize.value);
        }
      } catch (err) {
        if (selectedPrize.type === 'cash') updateBalance(selectedPrize.value);
        else addCoins(selectedPrize.value);
      }

      setPrizeMsg(`🎉 You won ${selectedPrize.label}!`);

      // Fire confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 4000);
  };

  return (
    <div className="w-full space-y-4 pt-2">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-[#12072b]/80 border border-purple-600/30 rounded-2xl p-3.5 backdrop-blur-xl">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-purple-900/40 text-purple-200 hover:text-white border border-purple-700/40"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-white flex items-center justify-center space-x-1.5">
            <span>🌸</span>
            <span>Spin & Win Fortune Wheel</span>
          </h2>
          <p className="text-[11px] text-purple-300/70">Spin daily to win cash & coins</p>
        </div>
        <div className="bg-purple-900/60 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-bold text-pink-400">
          {spinsLeft} Spins Left
        </div>
      </div>

      {/* Main Wheel Container */}
      <div className="bg-[#12072b]/80 border border-purple-600/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden flex flex-col items-center">
        {/* Glow behind wheel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Wheel Pointer */}
        <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-yellow-400 z-20 -mb-3 drop-shadow-md" />

        {/* Wheel Graphic */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-yellow-400 p-1.5 bg-gradient-to-tr from-purple-900 via-pink-900 to-indigo-950 shadow-2xl shadow-purple-900/60 overflow-hidden my-2">
          <div
            className="w-full h-full rounded-full relative transition-transform duration-[4000ms] cubic-bezier(0.15, 0.85, 0.35, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* Wheel slices rendered with SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 rounded-full">
              {prizes.map((prize, idx) => {
                const angle = 360 / prizes.length;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;

                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                const d = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                return (
                  <path
                    key={idx}
                    d={d}
                    fill={prize.color}
                    opacity="0.85"
                    stroke="#12072b"
                    strokeWidth="0.8"
                  />
                );
              })}
            </svg>

            {/* Labels overlay */}
            {prizes.map((prize, idx) => {
              const angle = (idx + 0.5) * (360 / prizes.length);
              return (
                <div
                  key={idx}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 origin-center text-[10px] font-black text-white drop-shadow-md whitespace-nowrap pointer-events-none"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translate(80px) rotate(90deg)`
                  }}
                >
                  {prize.label}
                </div>
              );
            })}
          </div>

          {/* Center Wheel Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 border-4 border-[#12072b] shadow-lg flex items-center justify-center text-slate-950 font-black text-xs z-10">
            SPIN
          </div>
        </div>

        {/* Prize Notification */}
        {prizeMsg && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-300 font-bold text-sm animate-pulse flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span>{prizeMsg}</span>
          </div>
        )}

        {/* Spin Action Button */}
        <button
          onClick={handleSpin}
          disabled={spinning || spinsLeft <= 0}
          className={`mt-6 w-full max-w-xs py-3.5 rounded-full font-black text-sm tracking-wide shadow-xl transition-all ${
            spinning || spinsLeft <= 0
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 via-purple-500 to-emerald-400 text-white shadow-purple-500/30 hover:scale-105 active:scale-95'
          }`}
        >
          {spinning ? 'Spinning Wheel...' : spinsLeft > 0 ? 'SPIN THE WHEEL NOW' : 'No Spins Left Today'}
        </button>
      </div>
    </div>
  );
};

export default SpinWin;
