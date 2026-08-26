'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../../services/api';
import { Conversation, Message, User } from '../../../types';
import { Send, MessageSquare, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function MessagesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialUser = searchParams.get('user');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialUser);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [input, setInput] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [showConvPanel, setShowConvPanel] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getConversations().then(res => setConversations(res.conversations || []))
      .catch(() => {}).finally(() => setLoadingConvs(false));
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;
    setLoadingMsgs(true);
    setShowConvPanel(false);
    api.getMessages(selectedUserId).then(res => {
      setMessages(res.messages || []);
      setOtherUser(res.user);
    }).catch(() => {}).finally(() => setLoadingMsgs(false));
  }, [selectedUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedUserId || sending) return;
    const content = input.trim();
    setInput('');
    setSending(true);
    try {
      const res = await api.sendMessage(selectedUserId, content);
      setMessages(prev => [...prev, res.message]);
    } catch {} finally { setSending(false); }
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Conversations panel */}
      <div className={`${showConvPanel ? 'flex' : 'hidden lg:flex'} flex-col w-full lg:w-72 border-r border-slate-800 bg-slate-900/50 flex-shrink-0`}>
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-lg font-bold text-white">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="space-y-2 p-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-800/40 rounded-xl animate-pulse" />)}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {conversations.map(conv => (
                <button key={conv.connectionId}
                  onClick={() => setSelectedUserId(conv.user.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    selectedUserId === conv.user.id ? 'bg-indigo-500/15 border border-indigo-500/20' : 'hover:bg-slate-800'
                  }`}>
                  {conv.user.profilePicture ? (
                    <img src={conv.user.profilePicture} alt={conv.user.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-700 flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {conv.user.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${selectedUserId === conv.user.id ? 'text-indigo-300' : 'text-white'}`}>{conv.user.name}</p>
                    {conv.lastMessage && (
                      <p className="text-xs text-slate-500 truncate">{conv.lastMessage.content}</p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat panel */}
      <div className={`${!showConvPanel ? 'flex' : 'hidden lg:flex'} flex-col flex-1 overflow-hidden`}>
        {!selectedUserId ? (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
            <MessageSquare size={48} className="mb-3 opacity-30" />
            <p className="text-lg font-medium text-slate-400">Select a conversation</p>
            <p className="text-sm">Choose someone from your connections to start chatting</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/50">
              <button onClick={() => setShowConvPanel(true)} className="lg:hidden text-slate-400 hover:text-white mr-1">
                <ArrowLeft size={18} />
              </button>
              {otherUser && (
                <>
                  {otherUser.profilePicture ? (
                    <img src={otherUser.profilePicture} alt={otherUser.name}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-700" />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white">
                      {otherUser.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium text-sm">{otherUser.name}</p>
                    <p className="text-slate-500 text-xs">{otherUser.college}</p>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex justify-center pt-8">
                  <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">No messages yet. Say hello! 👋</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                        isMine
                          ? 'bg-indigo-500 text-white rounded-br-sm'
                          : 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700'
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-indigo-200/70' : 'text-slate-500'}`}>
                          {msg.timestamp ? formatTime(msg.timestamp) : ''}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/30">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <button onClick={sendMessage} disabled={sending || !input.trim()}
                  className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl transition-colors flex items-center gap-2">
                  {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
