'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { StudentMatch, Connection } from '../../../types';
import StudentCard from '../../../components/StudentCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  Users,
  Bell,
  Code2,
  Briefcase,
  TrendingUp,
  UserCheck,
  Clock,
  Flame,
  Sparkles,
  ArrowRight,
  MessageSquare,
  GraduationCap
} from 'lucide-react';

export default function DashboardPage() {
  const { user, updateUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<StudentMatch[]>([]);
  const [connections, setConnections] = useState<{ pendingRequests: Connection[]; acceptedConnections: Connection[] }>({ pendingRequests: [], acceptedConnections: [] });
  const [notifications, setNotifications] = useState<{ unreadCount: number }>({ unreadCount: 0 });
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, connRes, notifRes] = await Promise.all([
        api.getRecommendations(),
        api.getConnections(),
        api.getNotifications(),
      ]);
      setRecommendations(recRes.recommendations?.slice(0, 3) || []);
      setConnections({ pendingRequests: connRes.pendingRequests || [], acceptedConnections: connRes.acceptedConnections || [] });
      setNotifications({ unreadCount: notifRes.unreadCount || 0 });
    } catch (e) {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setCheckInMsg('');
    try {
      const res = await api.checkInDSAStreak();
      if (res.user) updateUser(res.user);
      setCheckInMsg('🔥 Streak checked in!');
    } catch {
      setCheckInMsg('✅ Checked in today!');
    } finally {
      setCheckingIn(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const streak = user.dsaProfile?.streakCount || 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-7">
      {/* Top Welcome Hero Banner */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <GraduationCap size={14} className="text-indigo-600" />
            <span>{user.college || 'Campus Member'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-live" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
            Find peers to build projects with, form hackathon squads, or grind LeetCode problems together.
          </p>
        </div>

        {/* Quick Streak Widget on Banner */}
        <div className="flex items-center gap-3.5 bg-orange-50/60 p-4 rounded-2xl border border-orange-100 shadow-sm self-start md:self-auto">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/30">
            <Flame size={24} className="fill-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-orange-950/70 uppercase tracking-wider">DSA Daily Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">{streak} Days</span>
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline transition-colors"
              >
                {checkingIn ? 'Checking...' : 'Check-in'}
              </button>
            </div>
            {checkInMsg && <p className="text-xs text-emerald-700 font-semibold mt-0.5">{checkInMsg}</p>}
          </div>
        </div>
      </div>

      {/* Network Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Connections', value: connections.acceptedConnections.length, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/connections' },
          { label: 'Pending Requests', value: connections.pendingRequests.length, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50', link: '/connections' },
          { label: 'Unread Alerts', value: notifications.unreadCount, icon: Bell, color: 'text-violet-600', bg: 'bg-violet-50', link: '/notifications' },
          { label: 'Study Buddies', value: `${recommendations.length} Matched`, icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/explore' },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.link}
            className="card-human rounded-2xl p-4 flex flex-col justify-between group bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pending Connection Alert Banner */}
      {connections.pendingRequests.length > 0 && (
        <div className="flex items-center justify-between px-5 py-4 bg-amber-50 border border-amber-200/90 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-slate-900 text-sm font-bold">
                You have {connections.pendingRequests.length} pending request{connections.pendingRequests.length > 1 ? 's' : ''}
              </p>
              <p className="text-slate-600 text-xs">
                {connections.pendingRequests[0]?.user?.name} from {connections.pendingRequests[0]?.user?.college} wants to connect with you!
              </p>
            </div>
          </div>
          <Link
            href="/connections"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Respond
          </Link>
        </div>
      )}

      {/* Recommended Teammates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-600" />
              Smart Matches for You
            </h2>
            <p className="text-slate-500 text-xs">Students with complementary skills & shared collaboration goals</p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            Explore all students <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendations.map(({ student, match }) => (
              <StudentCard key={student.id} student={student} match={match} />
            ))}
            {recommendations.length === 0 && (
              <div className="col-span-3 text-center py-12 card-human rounded-2xl p-6 bg-white border border-slate-200">
                <Users size={36} className="mx-auto mb-2 text-indigo-600 opacity-60" />
                <p className="text-slate-900 font-bold text-sm">No recommendations generated yet</p>
                <p className="text-slate-500 text-xs mt-1">Complete your profile skills and goals to unlock match insights.</p>
                <Link
                  href="/profile"
                  className="inline-block mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                >
                  Edit My Profile
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Launchpad & Opportunities */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Collaboration Launchpad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              href: '/explore',
              icon: Compass,
              title: 'Discover Peers',
              desc: 'Filter students by tech stack & campus',
              color: 'bg-indigo-50 text-indigo-600',
              btn: 'Search'
            },
            {
              href: '/opportunities',
              icon: Briefcase,
              title: 'Team Postings',
              desc: 'Join hackathons, side projects & startups',
              color: 'bg-violet-50 text-violet-600',
              btn: 'View Openings'
            },
            {
              href: '/dsa',
              icon: Code2,
              title: 'DSA Practice Buddy',
              desc: 'Find coding buddies & track streaks',
              color: 'bg-emerald-50 text-emerald-600',
              btn: 'Start Streak'
            },
            {
              href: '/messages',
              icon: MessageSquare,
              title: 'Direct Chat',
              desc: 'Coordinate with your network instantly',
              color: 'bg-amber-50 text-amber-600',
              btn: 'Open Chat'
            },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="card-human rounded-2xl p-5 flex flex-col justify-between group bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform font-bold`}>
                  <item.icon size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-bold text-indigo-600 pt-2 border-t border-slate-100">
                <span>{item.btn}</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


