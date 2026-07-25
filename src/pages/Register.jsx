import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
import { Sparkles, Lock, User, Mail, ArrowRight, AlertCircle, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill referral code if present in URL parameter (e.g., ?ref=shahriar123)
  useEffect(() => {
    const codeFromUrl = searchParams.get('ref') || searchParams.get('referralCode');
    if (codeFromUrl) {
      setReferralCode(codeFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await register(username, email, password, referralCode);
      if (res?.success === false) {
        setErrorMsg(res.error || 'Registration failed.');
      } else if (res?.message) {
        setErrorMsg(res.message);
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg('Failed to create account. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-[#12072b]/90 border border-purple-600/40 w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl shadow-purple-950/80 backdrop-blur-xl text-center space-y-5 relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 mx-auto shadow-lg shadow-purple-500/30">
          <div className="w-full h-full bg-[#0b051b] rounded-[14px] flex items-center justify-center text-pink-400">
            <Sparkles className="w-7 h-7" />
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Create Account</h2>
          <p className="text-xs text-purple-300/70 mt-1">Start earning money today with TaskSphere</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-pink-500/20 border border-pink-500/40 rounded-xl text-pink-300 text-xs flex items-center space-x-2 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div>
            <label className="block text-[11px] font-bold text-purple-200/80 mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Choose username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-purple-950/70 border border-purple-700/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-purple-400 focus:outline-none focus:border-pink-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-purple-200/80 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-purple-950/70 border border-purple-700/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-purple-400 focus:outline-none focus:border-pink-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-purple-200/80 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Create strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-purple-950/70 border border-purple-700/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-purple-400 focus:outline-none focus:border-pink-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-purple-200/80 mb-1">
              Referral Code <span className="text-purple-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Gift className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter friend's referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full bg-purple-950/70 border border-purple-700/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-purple-400 focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-600 to-emerald-400 text-white font-black rounded-xl text-xs shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-purple-300/70 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-400 font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
