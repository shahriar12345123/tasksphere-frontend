import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import SpinWin from './pages/SpinWin';
import MicroTasks from './pages/MicroTasks';
import Withdraw from './pages/Withdraw';
import Plans from './pages/Plans';
import Referrals from './pages/Referrals';
import Support from './pages/Support';
import History from './pages/History';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// External redirect component for /apple route
const AppleAdminRedirect = () => {
  React.useEffect(() => {
    window.location.href = 'https://tasksphere-backend-m0e7.onrender.com';
  }, []);
  return (
    <div className="min-h-screen bg-[#0a0314] flex flex-col items-center justify-center text-white font-sans p-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 animate-spin mb-4">
        <div className="w-full h-full bg-[#0a0314] rounded-[14px]" />
      </div>
      <h2 className="text-lg font-bold">Redirecting to Apple Admin Panel...</h2>
      <p className="text-xs text-purple-300/70 mt-1">Connecting to https://tasksphere-backend-m0e7.onrender.com</p>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Panel Routes */}
          <Route path="/apple" element={<AppleAdminRedirect />} />
          <Route path="/apple/admin" element={<AppleAdminRedirect />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/spin" element={<SpinWin />} />
              <Route path="/tasks" element={<MicroTasks />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/plans" element={<Navigate to="/" replace />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/support" element={<Support />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
