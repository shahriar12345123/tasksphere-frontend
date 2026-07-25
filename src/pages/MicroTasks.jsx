import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Sparkles, ExternalLink, CheckCircle2, Hourglass, X, Layers } from 'lucide-react';
import { FacebookIcon as Facebook, YoutubeIcon as Youtube } from '../components/BrandIcons';
import { Send, Video } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../lib/supabase';

export const MicroTasks = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateBalance, setUser } = useAuth();
  const currentCategory = searchParams.get('category') || 'facebook';

  // Task execution states
  const [activeTimerTask, setActiveTimerTask] = useState(null); // taskId currently counting down
  const [countdown, setCountdown] = useState(15);
  const [proofModalTask, setProofModalTask] = useState(null); // task awaiting proof input
  const [proofInput, setProofInput] = useState('');
  const [taskStatuses, setTaskStatuses] = useState({}); // { [taskId]: 'pending' }
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [dynamicTasks, setDynamicTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch dynamic tasks from backend API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/tasks`);
        if (res.ok) {
          const data = await res.json();
          if (data.tasks) {
            setDynamicTasks(data.tasks);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch dynamic tasks from backend:', err);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, []);

  // Default Tasks Fallback List
  const defaultPlatformTasks = {
    facebook: [
      {
        id: 'fb-1',
        category: 'facebook',
        title: 'Like & Follow Official Facebook Page',
        platform: 'Facebook',
        reward: 0.04,
        time: '15s',
        icon: Facebook,
        iconBg: 'bg-blue-600',
        link: 'https://facebook.com',
        description: 'Open the page, click Like and Follow, then enter your Facebook profile link or username.'
      },
      {
        id: 'fb-2',
        category: 'facebook',
        title: 'Share Pinned Post to Personal Timeline',
        platform: 'Facebook',
        reward: 0.04,
        time: '15s',
        icon: Facebook,
        iconBg: 'bg-blue-600',
        link: 'https://facebook.com',
        description: 'Share the pinned post on your Facebook timeline publicly and enter your post link or username.'
      }
    ],
    youtube: [
      {
        id: 'yt-1',
        category: 'youtube',
        title: 'Subscribe YouTube Channel & Like Video',
        platform: 'YouTube',
        reward: 0.04,
        time: '15s',
        icon: Youtube,
        iconBg: 'bg-red-600',
        link: 'https://youtube.com',
        description: 'Subscribe to the channel, hit the like button on the video, and submit your YouTube handle or channel link.'
      },
      {
        id: 'yt-2',
        category: 'youtube',
        title: 'Watch & Comment on Featured Video',
        platform: 'YouTube',
        reward: 0.04,
        time: '15s',
        icon: Youtube,
        iconBg: 'bg-red-600',
        link: 'https://youtube.com',
        description: 'Watch the featured video, drop a helpful comment, and submit your YouTube channel link.'
      }
    ],
    telegram: [
      {
        id: 'tg-1',
        category: 'telegram',
        title: 'Join Official Telegram Channel',
        platform: 'Telegram',
        reward: 0.04,
        time: '15s',
        icon: Send,
        iconBg: 'bg-sky-500',
        link: 'https://telegram.org',
        description: 'Join our Telegram announcements channel and submit your Telegram @username.'
      }
    ],
    tiktok: [
      {
        id: 'tt-1',
        category: 'tiktok',
        title: 'Follow Official TikTok Handle',
        platform: 'TikTok',
        reward: 0.04,
        time: '15s',
        icon: Video,
        iconBg: 'bg-slate-900',
        link: 'https://tiktok.com',
        description: 'Follow the official TikTok account and submit your TikTok @username.'
      }
    ],
    twitter: [
      {
        id: 'tw-1',
        category: 'twitter',
        title: 'Follow Official Twitter Page',
        platform: 'Twitter',
        reward: 0.04,
        time: '15s',
        icon: Sparkles,
        iconBg: 'bg-blue-400',
        link: 'https://twitter.com',
        description: 'Follow our official X handle and submit your handle.'
      }
    ]
  };

  // Process and combine tasks
  const getTasksForCategory = () => {
    const formattedDynamic = dynamicTasks
      .filter((t) => (t.category || t.platform.toLowerCase()) === currentCategory.toLowerCase())
      .map((t) => {
        let icon = Sparkles;
        let iconBg = 'bg-purple-600';
        const p = (t.platform || '').toLowerCase();
        if (p.includes('youtube')) { icon = Youtube; iconBg = 'bg-red-600'; }
        else if (p.includes('facebook')) { icon = Facebook; iconBg = 'bg-blue-600'; }
        else if (p.includes('telegram')) { icon = Send; iconBg = 'bg-sky-500'; }
        else if (p.includes('tiktok')) { icon = Video; iconBg = 'bg-slate-900'; }

        return {
          id: t.id,
          category: t.category || currentCategory,
          title: t.title,
          platform: t.platform,
          reward: parseFloat(t.reward || 0.04),
          time: '15s',
          icon,
          iconBg,
          link: t.link,
          description: `Click Start Task to open ${t.platform} link, complete the work, and submit proof.`
        };
      });

    if (formattedDynamic.length > 0) {
      return formattedDynamic;
    }

    return defaultPlatformTasks[currentCategory] || defaultPlatformTasks.facebook;
  };

  const rawCategoryTasks = getTasksForCategory();
  const availableTasks = rawCategoryTasks.filter((task) => taskStatuses[task.id] !== 'pending');

  const categoryTitles = {
    facebook: 'Facebook Tasks',
    youtube: 'YouTube Tasks',
    telegram: 'Telegram Tasks',
    tiktok: 'TikTok Tasks',
    twitter: 'Twitter Tasks'
  };

  const handleStartTask = (task) => {
    window.open(task.link, '_blank');
    setActiveTimerTask(task.id);
    setCountdown(15);
  };

  useEffect(() => {
    let timerInterval = null;
    if (activeTimerTask && countdown > 0) {
      timerInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (activeTimerTask && countdown === 0) {
      const taskObj = rawCategoryTasks.find((t) => t.id === activeTimerTask);
      setActiveTimerTask(null);
      if (taskObj) {
        setProofModalTask(taskObj);
      }
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [activeTimerTask, countdown, rawCategoryTasks]);

  // Handle proof submission
  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!proofInput.trim() || !proofModalTask) return;

    setSubmitting(true);
    try {
      if (user.id) {
        await fetch(`${BACKEND_URL}/api/tasks/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            taskId: proofModalTask.id,
            platform: proofModalTask.platform,
            proof: proofInput,
            reward: proofModalTask.reward
          })
        });
      }

      setTaskStatuses((prev) => ({
        ...prev,
        [proofModalTask.id]: 'pending'
      }));

      showToast(`✅ Task submitted! Pending admin approval for +$${proofModalTask.reward.toFixed(2)} USD.`);
      setProofModalTask(null);
      setProofInput('');
    } catch (err) {
      console.warn('Backend submission error:', err);
      setTaskStatuses((prev) => ({
        ...prev,
        [proofModalTask.id]: 'pending'
      }));
      showToast(`✅ Task submitted! Pending admin approval.`);
      setProofModalTask(null);
      setProofInput('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-4 pt-2">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-full shadow-lg shadow-amber-400/30 text-xs sm:text-sm animate-bounce flex items-center space-x-2 border border-yellow-300">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between bg-[#12072b]/80 border border-purple-600/30 rounded-2xl p-3.5 backdrop-blur-xl">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-purple-900/40 text-purple-200 hover:text-white border border-purple-700/40"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-white">
            {categoryTitles[currentCategory] || 'Platform Tasks'}
          </h2>
          <p className="text-[11px] text-purple-300/70">Reward: $0.04 USD per task</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Account Activation Guard */}
      {!user?.isVerified ? (
        <div className="bg-[#12072b]/90 border border-purple-600/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-pink-500 rounded-2xl p-0.5 mx-auto shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#0b041a] rounded-[14px] flex items-center justify-center text-amber-400">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-wide">Account Activation Required</h3>
            <p className="text-xs text-purple-200/80 max-w-sm mx-auto leading-relaxed">
              You must activate your account ($1 USDT) to access micro-tasks and earn cash rewards. You can still invite friends and earn <span className="text-emerald-400 font-bold">$0.40 USD</span> active referral bonuses!
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all"
            >
              Go to Dashboard to Activate Account ($1 USDT)
            </button>
          </div>
        </div>
      ) : (
        /* Task List */
        <div className="space-y-3">
          {availableTasks.length > 0 ? (
            availableTasks.map((task) => {
              const IconComp = task.icon;
              const isTimerRunning = activeTimerTask === task.id;

              return (
                <div
                  key={task.id}
                  className="bg-[#12072b]/80 border border-purple-600/30 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-11 h-11 rounded-2xl ${task.iconBg} flex items-center justify-center text-white shadow-md flex-shrink-0 mt-0.5`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">{task.title}</h3>
                      <p className="text-[11px] text-purple-200/70 mt-0.5 line-clamp-2">{task.description}</p>
                      <div className="flex items-center space-x-3 text-[11px] text-purple-300/70 mt-1.5">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-purple-400" />
                          <span>{task.time}</span>
                        </span>
                        <span className="font-bold text-emerald-400">+$0.04 USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0 self-end sm:self-center">
                    {isTimerRunning ? (
                      <button
                        disabled
                        className="bg-purple-900/80 border border-purple-500/50 text-purple-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 animate-pulse"
                      >
                        <Clock className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Waiting {countdown}s...</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartTask(task)}
                        className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center space-x-1.5"
                      >
                        <span>Start Task</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            /* Empty State when all tasks are submitted / pending */
            <div className="bg-[#12072b]/80 border border-purple-600/30 rounded-3xl p-8 text-center space-y-3 shadow-xl backdrop-blur-xl">
              <div className="w-14 h-14 bg-emerald-500/20 border-2 border-emerald-400/50 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">All Tasks Submitted!</h3>
              <p className="text-xs text-purple-200/70 max-w-xs mx-auto leading-relaxed">
                You have completed all available tasks in this section. Your submissions are currently pending admin verification for your <span className="text-yellow-400 font-bold">$0.04 USD</span> rewards.
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-2 px-5 py-2.5 bg-purple-900/60 border border-purple-600/40 text-purple-200 font-bold rounded-xl text-xs hover:text-white transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- PROOF SUBMISSION POP-UP MODAL --- */}
      {proofModalTask && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c0b3b] border border-purple-500/40 w-full max-w-sm rounded-3xl p-5 text-left shadow-2xl relative space-y-4 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setProofModalTask(null)}
              className="absolute top-3.5 right-3.5 text-purple-300 hover:text-white p-1 rounded-full bg-purple-900/40"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-3 pt-1">
              <div className={`w-10 h-10 rounded-2xl ${proofModalTask.iconBg} flex items-center justify-center text-white shadow-md`}>
                <proofModalTask.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Submit Proof</h3>
                <p className="text-[11px] text-emerald-400 font-semibold">+$0.04 USD</p>
              </div>
            </div>

            <p className="text-xs text-purple-200/80 bg-purple-950/60 p-3 rounded-xl border border-purple-800/40 leading-relaxed">
              Task timer completed! Please enter your <span className="text-yellow-300 font-bold">username or profile URL</span> below to complete your submission.
            </p>

            {/* Proof Input Form */}
            <form onSubmit={handleSubmitProof} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                  Enter URL or Username:
                </label>
                <input
                  type="text"
                  placeholder="e.g. @yourusername or profile URL"
                  value={proofInput}
                  onChange={(e) => setProofInput(e.target.value)}
                  className="w-full bg-purple-950/80 border border-purple-700/50 rounded-xl px-4 py-3 text-xs font-medium text-white placeholder-purple-400 focus:outline-none focus:border-pink-500 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MicroTasks;
