'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { NotificationItem } from '../../../types';
import { Bell, Users, UserCheck, Star, CheckCheck, Check } from 'lucide-react';

// Map notification types to icons (dark‑theme friendly)
const NOTIF_ICON: Record<string, React.ReactNode> = {
  connection_request: <Users size={16} className="text-indigo-500" />,
  connection_accepted: <UserCheck size={16} className="text-emerald-500" />,
  opportunity_interest: <Star size={16} className="text-amber-500" />,
};

function NotificationsContent() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notifications on mount
  useEffect(() => {
    api
      .getNotifications()
      .then(res => setNotifications(res.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
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
    <div className="flex flex-col min-h-screen bg-[#09090B] p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-zinc-400 text-sm">
            Stay updated on your connections, messages and team requests
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-20 bg-zinc-800 rounded-2xl animate-pulse border border-zinc-700"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="card-human bg-zinc-800 border-zinc-700 text-center py-16">
          <Bell size={40} className="mx-auto mb-3 text-zinc-500" />
          <p className="text-white font-bold text-lg">All caught up!</p>
          <p className="text-zinc-400 text-sm mt-1">You have no new notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`card-human flex items-start gap-4 p-4 rounded-xl transition-all ${
                n.isRead
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  : 'bg-indigo-600/20 border-indigo-500 text-white'
              }`}
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  n.type === 'connection_request'
                    ? 'bg-indigo-100/20'
                    : n.type === 'connection_accepted'
                    ? 'bg-emerald-100/20'
                    : 'bg-amber-100/20'
                }`}
              >
                {NOTIF_ICON[n.type] || <Bell size={16} className="text-zinc-400" />}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold" style={{ color: n.isRead ? '#a1a1aa' : '#ffffff' }}>{n.title}</p>
                    <p className="text-zinc-300 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5" />}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {n.createdAt ? formatDate(n.createdAt) : 'recently'}
                  </span>
                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="flex items-center gap-1 text-xs font-bold text-indigo-300 hover:text-indigo-200 transition-colors"
                    >
                      <Check size={12} /> Mark read
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

export default function NotificationsPage() {
  return <NotificationsContent />;
}
