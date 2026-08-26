'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { NotificationItem } from '../../../types';
import { Bell, Users, UserCheck, Star, CheckCheck, Check } from 'lucide-react';

const NOTIF_ICON: Record<string, React.ReactNode> = {
  connection_request: <Users size={16} className="text-indigo-400" />,
  connection_accepted: <UserCheck size={16} className="text-emerald-400" />,
  opportunity_interest: <Star size={16} className="text-amber-400" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotifications().then(res => setNotifications(res.notifications || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="text-base px-2.5 py-0.5 rounded-full bg-indigo-500 text-white font-normal">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-400">Stay updated on your connections and activity</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl text-sm transition-all">
            <CheckCheck size={15} />Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-800/40 rounded-2xl animate-pulse" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Bell size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-slate-400 font-medium">All caught up!</p>
          <p className="text-sm">You have no notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                n.isRead
                  ? 'bg-slate-800/40 border-slate-700/30 opacity-70'
                  : 'bg-slate-800/70 border-slate-700/60 hover:border-slate-600'
              }`}>
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                n.type === 'connection_request' ? 'bg-indigo-500/15' :
                n.type === 'connection_accepted' ? 'bg-emerald-500/15' :
                'bg-amber-500/15'
              }`}>
                {NOTIF_ICON[n.type] || <Bell size={16} className="text-slate-400" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-semibold ${n.isRead ? 'text-slate-300' : 'text-white'}`}>{n.title}</p>
                    <p className="text-slate-400 text-sm mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                  {!n.isRead && (
                    <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-slate-500">
                    {n.createdAt ? formatDate(n.createdAt) : 'recently'}
                  </span>
                  {!n.isRead && (
                    <button onClick={() => markRead(n.id)}
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Check size={12} />Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
