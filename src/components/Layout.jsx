import React from 'react';
import { Outlet } from 'react-router';
import BottomNav from './BottomNav';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0b051b] text-gray-100 flex flex-col items-center justify-start selection:bg-pink-500 selection:text-white pb-20">
      {/* Background Ambient Glow Effects */}
      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[100px] right-[10%] w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main Container - Centered Mobile App Shell on all screens */}
      <main className="w-full max-w-md px-3 sm:px-4 z-10 pt-4">
        <Outlet />
      </main>

      {/* Bottom Floating Nav Bar for All Devices */}
      <BottomNav />
    </div>
  );
};

export default Layout;

