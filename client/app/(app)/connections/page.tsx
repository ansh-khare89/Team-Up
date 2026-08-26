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
    { id: 'pending' as Tab, label: 'Pending Requests', icon: Clock, count: pending.length, color: 'text-amber-600' },
    { id: 'sent' as Tab, label: 'Sent Invites', icon: Send, count: sent.length, color: 'text-indigo-600' },
    { id: 'connected' as Tab, label: 'My Network', icon: UserCheck, count: accepted.length, color: 'text-emerald-600' },
  ];

  const UserRow = ({ conn, actions }: { conn: Connection; actions?: React.ReactNode }) => (
    <div className="flex items-center gap-4 p-4 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <Link href={`/students/${conn.user.id}`} className="flex items-center gap-3.5 flex-1 min-w-0">
        {conn.user.profilePicture ? (
          <img src={conn.user.profilePicture} alt={conn.user.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
            {conn.user.name[0]}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-slate-900 font-bold text-sm hover:text-indigo-600 transition-colors">{conn.user.name}</p>
          <p className="text-slate-500 text-xs truncate">{conn.user.college} · {conn.user.branch}</p>
          <p className="text-slate-400 text-[11px] font-medium">{conn.user.yearOfStudy || conn.user.year}</p>
        </div>
      </Link>
      {actions}
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">My Network</h1>
        <p className="text-slate-500 text-sm">Manage incoming collaboration requests and active connections</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-200/60 p-1.5 rounded-2xl w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}>
            <t.icon size={15} className={tab === t.id ? t.color : ''} />
            <span>{t.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab === t.id ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-300/60 text-slate-600'}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-200" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Pending tab */}
          {tab === 'pending' && (
            pending.length === 0 ? (
              <div className="card-human bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
                <Clock size={40} className="mx-auto mb-3 text-slate-400" />
                <p className="text-slate-900 font-bold text-base">No pending requests</p>
                <p className="text-xs text-slate-500 mt-1">When someone sends you a connection invite, it will appear here.</p>
              </div>
            ) : pending.map(c => (
              <UserRow key={c.id} conn={c} actions={
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => respond(c.id, 'Accept')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all">
                    <Check size={14} />Accept
                  </button>
                  <button onClick={() => respond(c.id, 'Decline')}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors">
                    <X size={14} />Decline
                  </button>
                </div>
              } />
            ))
          )}

          {/* Sent tab */}
          {tab === 'sent' && (
            sent.length === 0 ? (
              <div className="card-human bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
                <Send size={40} className="mx-auto mb-3 text-slate-400" />
                <p className="text-slate-900 font-bold text-base">No sent requests</p>
                <p className="text-xs text-slate-500 mt-1">Requests you've sent will appear here.</p>
              </div>
            ) : sent.map(c => (
              <UserRow key={c.id} conn={c} actions={
                <span className="text-xs px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold rounded-xl flex-shrink-0">
                  Pending Approval
                </span>
              } />
            ))
          )}

          {/* Connected tab */}
          {tab === 'connected' && (
            accepted.length === 0 ? (
              <div className="card-human bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
                <Users size={40} className="mx-auto mb-3 text-slate-400" />
                <p className="text-slate-900 font-bold text-base">No connections yet</p>
                <p className="text-xs text-slate-500 mt-1">Start connecting with peers across colleges to grow your network.</p>
                <Link href="/explore" className="mt-3 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all">
                  Explore students →
                </Link>
              </div>
            ) : accepted.map(c => (
              <UserRow key={c.id} conn={c} actions={
                <Link href={`/messages?user=${c.user.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex-shrink-0">
                  <MessageSquare size={14} className="text-indigo-600" />Chat
                </Link>
              } />
            ))
          )}
        </div>
      )}
    </div>
  );
}

