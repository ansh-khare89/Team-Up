'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { NotificationItem } from '../../../types';
import { Bell, Users, UserCheck, Star, CheckCheck, Check } from 'lucide-react';

const NOTIF_ICON: Record<string, React.ReactNode> = {
  connection_request: <Users size={16} className="text-indigo-600" />,
  connection_accepted: <UserCheck size={16} className="text-emerald-600" />,
  opportunity_interest: <Star size={16} className="text-amber-600" />,
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
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm">Stay updated on your connections, messages and team requests</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all">
            <CheckCheck size={14} className="text-indigo-600" />Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-200" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="card-human bg-white rounded-3xl p-16 text-center text-slate-500 border border-slate-200">
          <Bell size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="text-slate-900 font-bold text-base">All caught up!</p>
          <p className="text-xs text-slate-500 mt-1">You have no new notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map(n => (
            <div key={n.id}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                n.isRead
                  ? 'bg-white border-slate-200/80 shadow-sm opacity-80'
                  : 'bg-indigo-50/40 border-indigo-200 shadow-sm'
              }`}>
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                n.type === 'connection_request' ? 'bg-indigo-100/70' :
                n.type === 'connection_accepted' ? 'bg-emerald-100/70' :
                'bg-amber-100/70'
              }`}>
                {NOTIF_ICON[n.type] || <Bell size={16} className="text-slate-600" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-bold ${n.isRead ? 'text-slate-800' : 'text-slate-900'}`}>{n.title}</p>
                    <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                  {!n.isRead && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {n.createdAt ? formatDate(n.createdAt) : 'recently'}
                  </span>
                  {!n.isRead && (
                    <button onClick={() => markRead(n.id)}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
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

