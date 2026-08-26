'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../../services/api';
import { Conversation, Message, User } from '../../../types';
import { Send, MessageSquare, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

function MessagesContent() {
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
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Conversations panel */}
      <div className={`${showConvPanel ? 'flex' : 'hidden lg:flex'} flex-col w-full lg:w-80 border-r border-slate-200 bg-white flex-shrink-0`}>
        <div className="p-4 border-b border-slate-100">
          <h1 className="text-lg font-bold text-slate-900">Direct Messages</h1>
          <p className="text-slate-500 text-xs mt-0.5">Chat with your campus collaborators</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="space-y-2 p-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <MessageSquare size={32} className="mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">No conversations yet</p>
              <p className="text-xs text-slate-400 mt-1">Connect with students to start chatting</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {conversations.map(conv => (
                <button key={conv.connectionId}
                  onClick={() => setSelectedUserId(conv.user.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                    selectedUserId === conv.user.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'
                  }`}>
                  {conv.user.profilePicture ? (
                    <img src={conv.user.profilePicture} alt={conv.user.name}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100 flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {conv.user.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${selectedUserId === conv.user.id ? 'text-indigo-700' : 'text-slate-900'}`}>{conv.user.name}</p>
                    {conv.lastMessage && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage.content}</p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
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
      <div className={`${!showConvPanel ? 'flex' : 'hidden lg:flex'} flex-col flex-1 overflow-hidden bg-slate-50`}>
        {!selectedUserId ? (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-500 p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
              <MessageSquare size={32} />
            </div>
            <p className="text-lg font-bold text-slate-900">Select a conversation</p>
            <p className="text-xs text-slate-500 max-w-xs mt-1">Choose a teammate from the left sidebar to coordinate projects, hackathons or DSA study sessions.</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-white shadow-sm">
              <button onClick={() => setShowConvPanel(true)} className="lg:hidden text-slate-500 hover:text-slate-900 mr-1">
                <ArrowLeft size={18} />
              </button>
              {otherUser && (
                <>
                  {otherUser.profilePicture ? (
                    <img src={otherUser.profilePicture} alt={otherUser.name}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                      {otherUser.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-slate-900 font-bold text-sm">{otherUser.name}</p>
                    <p className="text-slate-500 text-xs">{otherUser.college} · {otherUser.branch}</p>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex justify-center pt-8">
                  <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-sm font-medium text-slate-600">No messages yet. Say hello to start collaborating! 👋</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                        isMine
                          ? 'bg-indigo-600 text-white rounded-br-sm shadow-sm'
                          : 'bg-white text-slate-900 rounded-bl-sm border border-slate-200/90 shadow-sm'
                      }`}>
                        <p className="leading-relaxed">{msg.content}</p>
                        <p className={`text-[10px] mt-1 font-medium ${isMine ? 'text-indigo-200' : 'text-slate-400'}`}>
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
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message to your peer..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm font-medium transition-all"
                />
                <button onClick={sendMessage} disabled={sending || !input.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-all flex items-center gap-2 font-semibold text-xs">
                  {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={15} />}
                  <span>Send</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-slate-500">Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}

