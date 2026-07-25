import React from 'react';
import { NavLink } from 'react-router';
import { Home, ClipboardList, Wallet, Headphones, User } from 'lucide-react';

export const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-2 px-3 pointer-events-none">
      <div className="w-full max-w-md bg-[#13072b]/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl px-3 py-2 flex items-center justify-between shadow-2xl shadow-purple-950/80 pointer-events-auto relative">
        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all duration-200 ${
              isActive ? 'text-emerald-400 scale-105' : 'text-purple-300/70 hover:text-purple-200'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </NavLink>

        {/* Tasks */}
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all duration-200 ${
              isActive ? 'text-emerald-400 scale-105' : 'text-purple-300/70 hover:text-purple-200'
            }`
          }
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Tasks</span>
        </NavLink>

        {/* Floating Center Withdraw Button */}
        <NavLink
          to="/withdraw"
          className="flex flex-col items-center justify-center -mt-6 group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/40 border-4 border-[#0b051b] group-hover:scale-110 transition-transform duration-300">
            <Wallet className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 mt-0.5">Withdraw</span>
        </NavLink>

        {/* Support */}
        <NavLink
          to="/support"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all duration-200 ${
              isActive ? 'text-emerald-400 scale-105' : 'text-purple-300/70 hover:text-purple-200'
            }`
          }
        >
          <Headphones className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Support</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition-all duration-200 ${
              isActive ? 'text-emerald-400 scale-105' : 'text-purple-300/70 hover:text-purple-200'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNav;
