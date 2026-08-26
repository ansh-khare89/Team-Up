'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { Flame, Zap, Code2, Target, Sparkles } from 'lucide-react';
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
    LeetCode: 'text-amber-600 font-bold',
    Codeforces: 'text-blue-600 font-bold',
    HackerRank: 'text-emerald-600 font-bold',
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold mb-2">
          <Flame size={13} className="text-orange-500 fill-orange-500" />
          <span>Daily Grind & Accountability</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">DSA Partner Matching</h1>
        <p className="text-slate-500 text-sm">Find coding buddies solving problems at your level and hold each other accountable</p>
      </div>

      {/* Current user DSA card + check in */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Your DSA profile */}
        <div className="card-human bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Your DSA Profile</h2>
          {dsa ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-200">
                  <Flame size={24} className="text-orange-500 fill-orange-500" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900">{streakCount}</p>
                  <p className="text-slate-500 text-xs font-semibold">Active Day Streak 🔥</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {[
                  { label: 'Platform', value: dsa.platform, className: PLATFORM_COLORS[dsa.platform] || 'text-slate-900 font-bold' },
                  { label: 'Skill Level', value: dsa.experienceLevel, className: 'text-slate-900 font-bold' },
                  { label: 'Language', value: dsa.preferredLanguage, className: 'text-slate-900 font-bold' },
                  { label: 'Daily Goal', value: `${dsa.dailyGoal} problems`, className: 'text-slate-900 font-bold' },
                  { label: 'Preferred Time', value: dsa.preferredTime, className: 'text-slate-900 font-bold' },
                ].map(item => (
                  <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className={`text-xs ${item.className}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500">
              <Code2 size={32} className="mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">No DSA profile set up yet.</p>
              <Link href="/profile" className="text-indigo-600 font-semibold text-xs hover:underline mt-1 inline-block">Set up your profile →</Link>
            </div>
          )}
        </div>

        {/* Check-in card */}
        <div className="card-human bg-orange-50/70 border border-orange-200/90 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-5xl mb-3">{checkedIn ? '✅' : '🔥'}</div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            {checkedIn ? 'Streak Maintained Today!' : "Today's DSA Check-In"}
          </h2>
          <p className="text-slate-600 text-xs mb-5 max-w-sm">
            {checkedIn
              ? `Great job! You're on a ${streakCount}-day streak. Log in tomorrow to keep the momentum going.`
              : 'Solved your LeetCode/DSA problems today? Check in to maintain your streak.'}
          </p>
          <button
            onClick={handleCheckIn}
            disabled={checkingIn || checkedIn}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-xs shadow-sm transition-all ${
              checkedIn
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default font-bold'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {checkingIn ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : checkedIn ? (
              <><Zap size={16} />Checked In For Today ✓</>
            ) : (
              <><Flame size={16} className="fill-white" />Mark Today's Problems Solved</>
            )}
          </button>
        </div>
      </div>

      {/* DSA Matches */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" />
              Recommended Practice Buddies
            </h2>
            <p className="text-slate-500 text-xs">Students practicing at the same difficulty level and language</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-slate-200" />)}
          </div>
        ) : matches.length === 0 ? (
          <div className="card-human bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
            <Code2 size={40} className="mx-auto mb-3 text-slate-400" />
            <p className="text-slate-900 font-bold text-base">No DSA matches found</p>
            <p className="text-xs text-slate-500 mt-1">Explore all students or update your preferred language & platform in profile.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m, i) => (
              <Link href={`/students/${m.student.id}`} key={i}
                className="block group card-human bg-white hover:border-slate-300 border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-3.5 mb-3">
                  {m.student.profilePicture ? (
                    <img src={m.student.profilePicture} alt={m.student.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-lg font-bold text-white">
                      {m.student.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-900 font-bold text-sm group-hover:text-indigo-600 transition-colors">{m.student.name}</p>
                      <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">{m.compatibilityPercentage}% match</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{m.student.college} · {m.student.branch}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'Platform', value: m.dsaProfile?.platform, icon: Code2 },
                    { label: 'Level', value: m.dsaProfile?.experienceLevel, icon: Target },
                    { label: 'Streak', value: `${m.dsaProfile?.streakCount || 0}d streak 🔥`, icon: Flame },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                {m.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.highlights.map((h: string, j: number) => (
                      <span key={j} className="text-xs px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium rounded-lg">{h}</span>
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

