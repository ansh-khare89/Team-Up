'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Connection } from '../../../types';
import { UserCheck, Clock, Send, Check, X, MessageSquare, Users } from 'lucide-react';
import Link from 'next/link';

type Tab = 'pending' | 'sent' | 'connected';

export default function ConnectionsPage() {
  const [tab, setTab] = useState<Tab>('pending');
  const [pending, setPending] = useState<Connection[]>([]);
  const [sent, setSent] = useState<Connection[]>([]);
  const [accepted, setAccepted] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getConnections().then(res => {
      setPending(res.pendingRequests || []);
      setSent(res.sentRequests || []);
      setAccepted(res.acceptedConnections || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const respond = async (connectionId: string, action: 'Accept' | 'Decline') => {
    await api.respondToConnection(connectionId, action);
    setPending(prev => prev.filter(c => c.id !== connectionId));
    if (action === 'Accept') {
      const conn = pending.find(c => c.id === connectionId);
      if (conn) setAccepted(prev => [...prev, { ...conn, status: 'Accepted' }]);
    }
  };

  const TABS = [
    { id: 'pending' as Tab, label: 'Pending', icon: Clock, count: pending.length, color: 'text-amber-400' },
    { id: 'sent' as Tab, label: 'Sent', icon: Send, count: sent.length, color: 'text-blue-400' },
    { id: 'connected' as Tab, label: 'Connected', icon: UserCheck, count: accepted.length, color: 'text-emerald-400' },
  ];

  const UserRow = ({ conn, actions }: { conn: Connection; actions?: React.ReactNode }) => (
    <div className="flex items-center gap-4 p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
      <Link href={`/students/${conn.user.id}`} className="flex items-center gap-3 flex-1 min-w-0">
        {conn.user.profilePicture ? (
          <img src={conn.user.profilePicture} alt={conn.user.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-700 flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
            {conn.user.name[0]}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-white font-medium text-sm">{conn.user.name}</p>
          <p className="text-slate-400 text-xs truncate">{conn.user.college} · {conn.user.branch}</p>
          <p className="text-slate-500 text-xs">{conn.user.yearOfStudy || conn.user.year}</p>
        </div>
      </Link>
      {actions}
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Connections</h1>
        <p className="text-slate-400">Manage your network on Team Up</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50 w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.id ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}>
            <t.icon size={15} className={tab === t.id ? t.color : ''} />
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-slate-600 text-slate-200' : 'bg-slate-700/60 text-slate-500'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-800/40 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Pending tab */}
          {tab === 'pending' && (
            pending.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Clock size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-slate-400 font-medium">No pending requests</p>
                <p className="text-sm">When someone wants to connect, it'll appear here.</p>
              </div>
            ) : pending.map(c => (
              <UserRow key={c.id} conn={c} actions={
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => respond(c.id, 'Accept')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors">
                    <Check size={14} />Accept
                  </button>
                  <button onClick={() => respond(c.id, 'Decline')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded-xl text-sm transition-colors">
                    <X size={14} />
                  </button>
                </div>
              } />
            ))
          )}

          {/* Sent tab */}
          {tab === 'sent' && (
            sent.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Send size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-slate-400 font-medium">No sent requests</p>
                <p className="text-sm">Requests you've sent will appear here.</p>
              </div>
            ) : sent.map(c => (
              <UserRow key={c.id} conn={c} actions={
                <span className="text-xs px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex-shrink-0">
                  Pending
                </span>
              } />
            ))
          )}

          {/* Connected tab */}
          {tab === 'connected' && (
            accepted.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Users size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-slate-400 font-medium">No connections yet</p>
                <Link href="/explore" className="mt-2 inline-block text-indigo-400 hover:text-indigo-300 text-sm">
                  Explore students →
                </Link>
              </div>
            ) : accepted.map(c => (
              <UserRow key={c.id} conn={c} actions={
                <Link href={`/messages?user=${c.user.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm transition-colors flex-shrink-0">
                  <MessageSquare size={14} />Message
                </Link>
              } />
            ))
          )}
        </div>
      )}
    </div>
  );
}
