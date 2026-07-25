import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Sparkles, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('shahriar123');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res?.success === false) {
        setErrorMsg(res.error || 'Login failed.');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-[#12072b]/90 border border-purple-600/40 w-full max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl shadow-purple-950/80 backdrop-blur-xl text-center space-y-5 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 mx-auto shadow-lg shadow-purple-500/30">
          <div className="w-full h-full bg-[#0b051b] rounded-[14px] flex items-center justify-center text-pink-400">
            <Sparkles className="w-7 h-7" />
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Welcome Back</h2>
          <p className="text-xs text-purple-300/70 mt-1">Log in to your TASKVEROO account</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-pink-500/20 border border-pink-500/40 rounded-xl text-pink-300 text-xs flex items-center space-x-2 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div>
            <label className="block text-[11px] font-bold text-purple-200/80 mb-1">Username or Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-purple-950/70 border border-purple-700/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-purple-400 focus:outline-none focus:border-pink-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-600 to-emerald-400 text-white font-black rounded-xl text-xs shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <span>{loading ? 'Logging in...' : 'Log In Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-purple-300/70 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-pink-400 font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
