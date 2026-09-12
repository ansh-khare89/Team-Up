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
        <div className="w-8 h-8 border-2 border-[#FDF2D8] border-t-[#FF6B35] rounded-full animate-spin" />
      </div>
    );
  }

  const streak = user.dsaProfile?.streakCount || 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Welcome Hero Banner */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-[#FDF2D8] p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 border-2 border-[#FF6B35]/30 text-[#FF6B35] text-xs font-semibold">
            <GraduationCap size={14} className="text-[#FF6B35]" />
            <span>{user.college || 'Campus Member'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-live" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gradient tracking-tight">
            {greeting}, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-[#8B8680] text-sm max-w-xl leading-relaxed">
            Find peers to build projects with, form hackathon squads, or grind LeetCode problems together.
          </p>
        </div>

        {/* Quick Streak Widget on Banner */}
        <div className="flex items-center gap-3.5 bg-gradient-to-r from-[#FFF9ED] to-[#FFF4E5] p-4 rounded-2xl border-2 border-[#FDF2D8] shadow-sm self-start md:self-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#4ECDC4] flex items-center justify-center text-white shadow-sm shadow-[#FF6B35]/20">
            <Flame size={24} className="fill-white" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#FF6B35]/70 uppercase tracking-wider">DSA Daily Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#2D2A26]">{streak} Days</span>
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="text-xs font-bold text-[#FF6B35] hover:text-[#FF8C42] underline transition-colors"
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
          { label: 'Active Connections', value: connections.acceptedConnections.length, icon: UserCheck, color: 'text-[#FF6B35]', bg: 'bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10', link: '/connections' },
          { label: 'Pending Requests', value: connections.pendingRequests.length, icon: Users, color: 'text-[#FF8C42]', bg: 'bg-gradient-to-r from-[#FF8C42]/10 to-[#FF6B35]/10', link: '/connections' },
          { label: 'Unread Alerts', value: notifications.unreadCount, icon: Bell, color: 'text-[#4ECDC4]', bg: 'bg-gradient-to-r from-[#4ECDC4]/10 to-teal-50', link: '/notifications' },
          { label: 'Study Buddies', value: `${recommendations.length} Matched`, icon: Sparkles, color: 'text-teal-600', bg: 'bg-gradient-to-r from-teal-50 to-emerald-50', link: '/explore' },
        ].map(stat => (
          <Link
            key={stat.label}
            href={stat.link}
            className="card-human rounded-2xl p-4 flex flex-col justify-between group bg-white border-2 border-[#FDF2D8] shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <ArrowRight size={14} className="text-[#8B8680] group-hover:text-[#FF6B35] transition-colors" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2D2A26]">{stat.value}</p>
              <span className="text-xs text-[#8B8680] font-medium">{stat.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pending Connection Alert Banner */}
      {connections.pendingRequests.length > 0 && (
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#FF8C42]/10 to-[#FF6B35]/10 border-2 border-[#FF8C42]/30 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8C42]/20 to-[#FF6B35]/20 flex items-center justify-center text-[#FF8C42] font-bold">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-[#2D2A26] text-sm font-bold">
                You have {connections.pendingRequests.length} pending request{connections.pendingRequests.length > 1 ? 's' : ''}
              </p>
              <p className="text-[#8B8680] text-xs">
                {connections.pendingRequests[0]?.user?.name} from {connections.pendingRequests[0]?.user?.college} wants to connect with you!
              </p>
            </div>
          </div>
          <Link
            href="/connections"
            className="btn-creative px-4 py-2 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Respond
          </Link>
        </div>
      )}

      {/* Recommended Teammates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#2D2A26] flex items-center gap-2">
              <TrendingUp size={20} className="text-[#FF6B35]" />
              Smart Matches for You
            </h2>
            <p className="text-[#8B8680] text-xs">Students with complementary skills & shared collaboration goals</p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-[#FF6B35] hover:text-[#FF8C42] flex items-center gap-1 transition-colors"
          >
            Explore all students <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border-2 border-[#FDF2D8]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendations.map(({ student, match }) => (
              <StudentCard key={student.id} student={student} match={match} />
            ))}
            {recommendations.length === 0 && (
              <div className="col-span-3 text-center py-12 card-human rounded-2xl p-6 bg-white border-2 border-[#FDF2D8]">
                <Users size={36} className="mx-auto mb-2 text-[#FF6B35] opacity-60" />
                <p className="text-[#2D2A26] font-bold text-sm">No recommendations generated yet</p>
                <p className="text-[#8B8680] text-xs mt-1">Complete your profile skills and goals to unlock match insights.</p>
                <Link
                  href="/profile"
                  className="btn-creative inline-block mt-4 px-4 py-2 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
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
        <h2 className="text-lg font-bold text-[#2D2A26]">Collaboration Launchpad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              href: '/explore',
              icon: Compass,
              title: 'Discover Peers',
              desc: 'Filter students by tech stack & campus',
              color: 'bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 text-[#FF6B35]',
              btn: 'Search'
            },
            {
              href: '/opportunities',
              icon: Briefcase,
              title: 'Team Postings',
              desc: 'Join hackathons, side projects & startups',
              color: 'bg-gradient-to-r from-[#4ECDC4]/10 to-teal-50 text-[#4ECDC4]',
              btn: 'View Openings'
            },
            {
              href: '/dsa',
              icon: Code2,
              title: 'DSA Practice Buddy',
              desc: 'Find coding buddies & track streaks',
              color: 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-600',
              btn: 'Start Streak'
            },
            {
              href: '/messages',
              icon: MessageSquare,
              title: 'Direct Chat',
              desc: 'Coordinate with your network instantly',
              color: 'bg-gradient-to-r from-[#FF8C42]/10 to-[#FF6B35]/10 text-[#FF8C42]',
              btn: 'Open Chat'
            },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="card-human rounded-2xl p-5 flex flex-col justify-between group bg-white border-2 border-[#FDF2D8] shadow-sm"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform font-bold`}>
                  <item.icon size={20} />
                </div>
                <h3 className="font-bold text-[#2D2A26] text-sm group-hover:text-[#FF6B35] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#8B8680] text-xs mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#FF6B35] pt-2 border-t-2 border-[#FDF2D8]">
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


