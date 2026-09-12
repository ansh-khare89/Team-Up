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
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const streak = user.dsaProfile?.streakCount || 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Welcome Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#18181B] to-[#1C1C24] border border-zinc-800 p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl" />
        
        <div className="space-y-3 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
            <GraduationCap size={14} className="text-violet-400" />
            <span>{user.college || 'Campus Member'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-live" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {greeting}, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
            Find peers to build projects with, form hackathon squads, or grind LeetCode problems together.
          </p>
        </div>

        {/* Quick Streak Widget on Banner */}
        <div className="flex items-center gap-3.5 bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 shadow-lg self-start md:self-auto relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/15">
            <Flame size={24} className="fill-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">DSA Daily Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">{streak} Days</span>
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="text-xs font-bold text-violet-400 hover:text-violet-300 underline transition-colors"
              >
                {checkingIn ? 'Checking...' : 'Check-in'}
              </button>
            </div>
            {checkInMsg && <p className="text-xs text-emerald-400 font-semibold mt-0.5">{checkInMsg}</p>}
          </div>
        </div>
      </div>

      {/* Network Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Connections', value: connections.acceptedConnections.length, icon: UserCheck, color: 'text-violet-400', bg: 'bg-violet-500/10', link: '/connections' },
          { label: 'Pending Requests', value: connections.pendingRequests.length, icon: Users, color: 'text-sky-400', bg: 'bg-sky-500/10', link: '/connections' },
          { label: 'Unread Alerts', value: notifications.unreadCount, icon: Bell, color: 'text-amber-400', bg: 'bg-amber-500/10', link: '/notifications' },
          { label: 'Study Buddies', value: `${recommendations.length} Matched`, icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/10', link: '/explore' },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.link}
            className="card-human rounded-xl p-4 flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <ArrowRight size={14} className="text-zinc-600 group-hover:text-violet-400 transition-colors" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <span className="text-xs text-zinc-500 font-medium">{stat.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pending Connection Alert Banner */}
      {connections.pendingRequests.length > 0 && (
        <div className="flex items-center justify-between px-5 py-4 bg-violet-500/5 border border-violet-500/15 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-white text-sm font-bold">
                You have {connections.pendingRequests.length} pending request{connections.pendingRequests.length > 1 ? 's' : ''}
              </p>
              <p className="text-zinc-400 text-xs">
                {connections.pendingRequests[0]?.user?.name} from {connections.pendingRequests[0]?.user?.college} wants to connect with you!
              </p>
            </div>
          </div>
          <Link
            href="/connections"
            className="btn-creative px-4 py-2 text-white text-xs font-bold rounded-xl transition-all"
          >
            Respond
          </Link>
        </div>
      )}

      {/* Recommended Teammates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-violet-400" />
              Smart Matches for You
            </h2>
            <p className="text-zinc-500 text-xs">Students with complementary skills & shared collaboration goals</p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            Explore all students <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-zinc-800/50 rounded-2xl animate-pulse border border-zinc-700/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendations.map(({ student, match }) => (
              <StudentCard key={student.id} student={student} match={match} />
            ))}
            {recommendations.length === 0 && (
              <div className="col-span-3 text-center py-12 card-human rounded-2xl p-6">
                <Users size={36} className="mx-auto mb-2 text-zinc-600" />
                <p className="text-white font-bold text-sm">No recommendations generated yet</p>
                <p className="text-zinc-500 text-xs mt-1">Complete your profile skills and goals to unlock match insights.</p>
                <Link
                  href="/profile"
                  className="btn-creative inline-block mt-4 px-4 py-2 text-white rounded-xl text-xs font-semibold transition-all"
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
        <h2 className="text-lg font-bold text-white">Collaboration Launchpad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              href: '/explore',
              icon: Compass,
              title: 'Discover Peers',
              desc: 'Filter students by tech stack & campus',
              color: 'bg-violet-500/10 text-violet-400',
              btn: 'Search'
            },
            {
              href: '/opportunities',
              icon: Briefcase,
              title: 'Team Postings',
              desc: 'Join hackathons, side projects & startups',
              color: 'bg-sky-500/10 text-sky-400',
              btn: 'View Openings'
            },
            {
              href: '/dsa',
              icon: Code2,
              title: 'DSA Practice Buddy',
              desc: 'Find coding buddies & track streaks',
              color: 'bg-amber-500/10 text-amber-400',
              btn: 'Start Streak'
            },
            {
              href: '/messages',
              icon: MessageSquare,
              title: 'Direct Chat',
              desc: 'Coordinate with your network instantly',
              color: 'bg-emerald-500/10 text-emerald-400',
              btn: 'Open Chat'
            },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="card-human rounded-xl p-5 flex flex-col justify-between group"
            >
              <div>
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform font-bold`}>
                  <item.icon size={20} />
                </div>
                <h3 className="font-bold text-white text-sm group-hover:text-violet-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-bold text-violet-400 pt-2 border-t border-zinc-700/50">
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
