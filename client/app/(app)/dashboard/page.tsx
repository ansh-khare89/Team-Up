'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { StudentMatch, Connection, NotificationItem } from '../../../types';
import StudentCard from '../../../components/StudentCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, Users, Bell, Code2, Briefcase, TrendingUp, UserCheck, Clock, Flame } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<StudentMatch[]>([]);
  const [connections, setConnections] = useState<{ pendingRequests: Connection[]; acceptedConnections: Connection[] }>({ pendingRequests: [], acceptedConnections: [] });
  const [notifications, setNotifications] = useState<{ unreadCount: number }>({ unreadCount: 0 });
  const [loading, setLoading] = useState(true);

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

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const streak = user.dsaProfile?.streakCount || 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          {greeting}, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-400">Here's what's happening on Team Up today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Connections', value: connections.acceptedConnections.length, icon: UserCheck, color: 'text-indigo-400', bg: 'bg-indigo-500/10', link: '/connections' },
          { label: 'Pending Requests', value: connections.pendingRequests.length, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10', link: '/connections' },
          { label: 'Notifications', value: notifications.unreadCount, icon: Bell, color: 'text-violet-400', bg: 'bg-violet-500/10', link: '/notifications' },
          { label: 'DSA Streak', value: `${streak}🔥`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10', link: '/dsa' },
        ].map(stat => (
          <Link key={stat.label} href={stat.link}
            className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-4 transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon size={16} className={stat.color} />
              </div>
              <span className="text-xs text-slate-400">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Pending requests alert */}
      {connections.pendingRequests.length > 0 && (
        <div className="mb-6 flex items-center justify-between px-5 py-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-amber-400" />
            <div>
              <p className="text-white text-sm font-medium">You have {connections.pendingRequests.length} pending connection request{connections.pendingRequests.length > 1 ? 's' : ''}</p>
              <p className="text-amber-300/70 text-xs">{connections.pendingRequests[0]?.user?.name} wants to connect with you</p>
            </div>
          </div>
          <Link href="/connections" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-semibold rounded-xl transition-colors">
            Review
          </Link>
        </div>
      )}

      {/* Recommended matches */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><TrendingUp size={18} className="text-indigo-400" /> Recommended for You</h2>
            <p className="text-slate-400 text-sm">Based on your skills and goals</p>
          </div>
          <Link href="/explore" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">View all →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-56 bg-slate-800/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map(({ student, match }) => (
              <StudentCard key={student.id} student={student} match={match} />
            ))}
            {recommendations.length === 0 && (
              <div className="col-span-3 text-center py-12 text-slate-500">
                <Users size={32} className="mx-auto mb-2 opacity-50" />
                <p>No recommendations yet. Complete your profile to get matched!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: '/explore', icon: Compass, label: 'Explore Students', desc: 'Discover new people', color: 'from-indigo-500 to-blue-600' },
            { href: '/opportunities', icon: Briefcase, label: 'Opportunities', desc: 'Find or post projects', color: 'from-violet-500 to-purple-600' },
            { href: '/dsa', icon: Code2, label: 'DSA Partner', desc: 'Find coding buddies', color: 'from-emerald-500 to-teal-600' },
            { href: '/messages', icon: Bell, label: 'Messages', desc: 'Chat with your network', color: 'from-amber-500 to-orange-600' },
          ].map(action => (
            <Link key={action.href} href={action.href}
              className="group p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-2xl transition-all">
              <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-lg`}>
                <action.icon size={18} className="text-white" />
              </div>
              <p className="text-sm font-semibold text-white mb-0.5">{action.label}</p>
              <p className="text-xs text-slate-400">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
