'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { Flame, Zap, Code2, Calendar, Target } from 'lucide-react';
import Link from 'next/link';

export default function DSAPage() {
  const { user, updateUser } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [streakCount, setStreakCount] = useState(user?.dsaProfile?.streakCount || 0);

  useEffect(() => {
    api.getDSAMatches().then(res => setMatches(res.matches || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setStreakCount(user?.dsaProfile?.streakCount || 0);
    // Check if already checked in today
    const lastCheckIn = user?.dsaProfile?.lastCheckIn;
    if (lastCheckIn) {
      const today = new Date().toISOString().split('T')[0];
      if (lastCheckIn.startsWith(today)) setCheckedIn(true);
    }
  }, [user]);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const res = await api.checkInDSAStreak();
      setStreakCount(res.dsaProfile.streakCount);
      setCheckedIn(true);
      updateUser(res.user);
    } catch {} finally { setCheckingIn(false); }
  };

  const dsa = user?.dsaProfile;

  const PLATFORM_COLORS: Record<string, string> = {
    LeetCode: 'text-amber-400',
    Codeforces: 'text-blue-400',
    HackerRank: 'text-emerald-400',
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">DSA Partner</h1>
        <p className="text-slate-400">Find your daily coding buddy and maintain your streak together</p>
      </div>

      {/* Current user DSA card + check in */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Your DSA profile */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Your DSA Profile</h2>
          {dsa ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/15 rounded-2xl flex items-center justify-center">
                  <Flame size={24} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{streakCount}</p>
                  <p className="text-slate-400 text-sm">day streak 🔥</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: 'Platform', value: dsa.platform, className: PLATFORM_COLORS[dsa.platform] || 'text-white' },
                  { label: 'Level', value: dsa.experienceLevel, className: 'text-white' },
                  { label: 'Language', value: dsa.preferredLanguage, className: 'text-white' },
                  { label: 'Daily Goal', value: `${dsa.dailyGoal} problems`, className: 'text-white' },
                  { label: 'Preferred Time', value: dsa.preferredTime, className: 'text-white' },
                ].map(item => (
                  <div key={item.label} className="bg-slate-700/40 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                    <p className={`text-sm font-medium ${item.className}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500">
              <Code2 size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No DSA profile set up yet.</p>
              <Link href="/profile" className="text-indigo-400 text-sm hover:underline">Set up your profile →</Link>
            </div>
          )}
        </div>

        {/* Check-in card */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-3">{checkedIn ? '✅' : '🔥'}</div>
          <h2 className="text-xl font-bold text-white mb-2">
            {checkedIn ? 'Streak maintained!' : "Today's Check-In"}
          </h2>
          <p className="text-slate-400 text-sm mb-5">
            {checkedIn
              ? `You're on a ${streakCount}-day streak! Keep it going tomorrow.`
              : 'Solved your daily problems? Check in to keep your streak alive!'}
          </p>
          <button
            onClick={handleCheckIn}
            disabled={checkingIn || checkedIn}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold transition-all ${
              checkedIn
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25'
            }`}
          >
            {checkingIn ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : checkedIn ? (
              <><Zap size={18} />Checked In ✓</>
            ) : (
              <><Flame size={18} />Check In Today</>
            )}
          </button>
        </div>
      </div>

      {/* DSA Matches */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Find Your DSA Match</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-800/40 rounded-2xl animate-pulse" />)}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Code2 size={40} className="mx-auto mb-3 opacity-40" />
            <p>No DSA matches found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m, i) => (
              <Link href={`/students/${m.student.id}`} key={i}
                className="block group bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 rounded-2xl p-5 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  {m.student.profilePicture ? (
                    <img src={m.student.profilePicture} alt={m.student.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-700" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white">
                      {m.student.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold text-sm group-hover:text-indigo-300">{m.student.name}</p>
                      <span className="text-xs text-emerald-400 font-semibold">{m.compatibilityPercentage}% match</span>
                    </div>
                    <p className="text-slate-400 text-xs">{m.student.college}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'Platform', value: m.dsaProfile?.platform, icon: Code2 },
                    { label: 'Level', value: m.dsaProfile?.experienceLevel, icon: Target },
                    { label: 'Streak', value: `${m.dsaProfile?.streakCount || 0}🔥`, icon: Flame },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-700/40 rounded-xl p-2 text-center">
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className="text-xs font-medium text-white mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                {m.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {m.highlights.map((h: string, j: number) => (
                      <span key={j} className="text-xs px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg">{h}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
