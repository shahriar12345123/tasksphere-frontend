import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, BACKEND_URL } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default initial user state matching design aesthetics
  const [user, setUser] = useState({
    id: null,
    username: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isVerified: false,
    balance: 0.00,
    currency: 'USD',
    coins: 0,
    vipLevel: 'VIP 1',
    email: '',
    binanceUid: '',
    referredBy: '',
    referralsCount: 0,
    referralCommission: 0.00
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sync profile with Supabase / Backend Server
  const syncProfile = async (authUserId, emailVal, usernameVal, referralCodeVal = '') => {
    try {
      // 1. Try Backend API first
      const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authUserId,
          email: emailVal,
          username: usernameVal,
          referredBy: referralCodeVal
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setUser((prev) => ({
            ...prev,
            id: data.profile.id,
            username: data.profile.username || prev.username,
            email: data.profile.email || prev.email,
            isVerified: data.profile.is_verified ?? prev.isVerified,
            balance: parseFloat(data.profile.balance || 0),
            coins: parseInt(data.profile.coins || 0),
            vipLevel: data.profile.vip_level || prev.vipLevel,
            binanceUid: data.profile.binance_uid || prev.binanceUid,
            referredBy: data.profile.referred_by || referralCodeVal || prev.referredBy,
            referralsCount: parseInt(data.profile.referrals_count || 0),
            referralCommission: parseFloat(data.profile.referral_commission || 0)
          }));
          return;
        }
      }
    } catch (err) {
      console.warn('Backend API sync fallback:', err.message);
    }

    // 2. Direct Supabase fallback
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .maybeSingle();

      if (profile) {
        setUser((prev) => ({
          ...prev,
          id: profile.id,
          username: profile.username || prev.username,
          email: profile.email || prev.email,
          isVerified: profile.is_verified ?? prev.isVerified,
          balance: parseFloat(profile.balance || 0),
          coins: parseInt(profile.coins || 0),
          vipLevel: profile.vip_level || prev.vipLevel,
          binanceUid: profile.binance_uid || prev.binanceUid,
          referredBy: profile.referred_by || referralCodeVal || prev.referredBy,
          referralsCount: parseInt(profile.referrals_count || 0),
          referralCommission: parseFloat(profile.referral_commission || 0)
        }));
      }
    } catch (err) {
      console.warn('Supabase profile fetch warning:', err.message);
    }
  };

  useEffect(() => {
    // Get initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setIsAuthenticated(true);
        syncProfile(session.user.id, session.user.email, session.user.user_metadata?.username);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        setIsAuthenticated(true);
        syncProfile(session.user.id, session.user.email, session.user.user_metadata?.username);
      } else {
        setIsAuthenticated(false);
        setUser({
          id: null, username: '', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          isVerified: false, balance: 0.00, currency: 'USD', coins: 0, vipLevel: 'VIP 1',
          email: '', binanceUid: '', referredBy: '', referralsCount: 0, referralCommission: 0.00
        });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Live Auto-Sync: Re-fetches database changes every 4 seconds so admin edits show instantly in user UI
  useEffect(() => {
    if (!session?.user) return;
    const interval = setInterval(() => {
      syncProfile(session.user.id, session.user.email, session.user.user_metadata?.username);
    }, 4000);
    return () => clearInterval(interval);
  }, [session]);

  const login = async (emailOrUsername, password) => {
    try {
      const isEmail = emailOrUsername.includes('@');
      let targetEmail = emailOrUsername;

      if (!isEmail) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', emailOrUsername)
          .maybeSingle();

        if (profile?.email) {
          targetEmail = profile.email;
        } else {
          targetEmail = `${emailOrUsername}@taskveroo.pro`;
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password
      });

      if (error) {
        console.error('Supabase login error:', error.message);
        return { success: false, error: error.message };
      }

      setIsAuthenticated(true);
      if (data?.user) {
        await syncProfile(data.user.id, data.user.email, data.user.user_metadata?.username);
      }
      return { success: true };
    } catch (err) {
      console.error('Login exception:', err);
      return { success: false, error: err.message || 'Login failed. Please try again.' };
    }
  };

  const register = async (username, email, password, referralCode = '') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, referralCode }
        }
      });

      if (error) {
        console.error('Supabase register error:', error.message);
        return { success: false, error: error.message };
      }

      const authUser = data?.user;

      if (authUser) {
        setIsAuthenticated(true);
        await syncProfile(authUser.id, email, username, referralCode);
      } else {
        // Supabase may require email confirmation — user created but session not active yet
        return { success: true, message: 'Please check your email to confirm your account.' };
      }

      return { success: true };
    } catch (err) {
      console.error('Register exception:', err);
      return { success: false, error: err.message || 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Signout error:', err);
    }
    setIsAuthenticated(false);
    setSession(null);
  };

  const updateBalance = (amount) => {
    setUser((prev) => ({
      ...prev,
      balance: Math.max(0, parseFloat((prev.balance + amount).toFixed(2)))
    }));
  };

  const addCoins = (amount) => {
    setUser((prev) => ({
      ...prev,
      coins: prev.coins + amount
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        setUser,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateBalance,
        addCoins,
        syncProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
