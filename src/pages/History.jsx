import React, { useEffect, useState } from 'react';
import { ArrowLeft, History as HistoryIcon, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL, supabase } from '../lib/supabase';

export const History = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchWithdrawalHistory = async () => {
      setLoading(true);
      try {
        // Fetch Withdrawal Requests exclusively
        const res = await fetch(`${BACKEND_URL}/api/history/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.history) {
            setWithdrawals(data.history);
            return;
          }
        }

        // Direct Supabase fallback
        const { data: dbWithdrawals } = await supabase
          .from('withdrawals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (dbWithdrawals) {
          setWithdrawals(dbWithdrawals);
        }
      } catch (err) {
        console.warn('Withdrawal history fetch fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawalHistory();
  }, [user?.id]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
            Rejected
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            Pending Admin Review
          </span>
        );
    }
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
          <h2 className="text-lg font-bold text-white">Withdrawal History</h2>
          <p className="text-[11px] text-purple-300/70">Status of your payout requests</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Withdrawal Requests List */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="text-center py-8 text-xs text-purple-300">Loading withdrawal history...</div>
        ) : withdrawals.length > 0 ? (
          withdrawals.map((item) => (
            <div
              key={item.id}
              className="bg-[#12072b]/80 border border-purple-600/30 rounded-2xl p-4 flex items-center justify-between backdrop-blur-xl shadow-md"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Binance Pay Payout</h4>
                  <p className="text-[10px] text-purple-300/70 mt-0.5 font-mono">
                    Binance UID: {item.binance_uid}
                  </p>
                  <p className="text-[10px] text-purple-400 mt-0.5">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-xs font-black text-pink-400">
                  -${parseFloat(item.amount).toFixed(2)} USDT
                </div>
                <div>{getStatusBadge(item.status)}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#12072b]/80 border border-purple-600/30 rounded-3xl p-8 text-center space-y-2 shadow-xl backdrop-blur-xl">
            <HistoryIcon className="w-8 h-8 text-purple-400 mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white">No Withdrawal History</h3>
            <p className="text-xs text-purple-300/70">You have not submitted any withdrawal requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
