'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  Users,
  MessageSquare,
  Briefcase,
  Code2,
  Bell,
  LogOut,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home Feed', icon: LayoutDashboard, badge: null },
  { href: '/explore', label: 'Discover Peers', icon: Compass, badge: 'Hot' },
  { href: '/connections', label: 'My Network', icon: Users, badge: null },
  { href: '/messages', label: 'Messages', icon: MessageSquare, badge: null },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase, badge: 'New' },
  { href: '/dsa', label: 'DSA Buddy & Streaks', icon: Code2, badge: '🔥' },
  { href: '/notifications', label: 'Notifications', icon: Bell, badge: null },
];

const DEMO_USERS = [
  { id: 'user-anshk', name: 'Ansh Kumar', college: 'IIT Bombay', role: 'Full Stack & AI' },
  { id: 'user-rahul', name: 'Rahul Sharma', college: 'BITS Pilani', role: 'CV & Deep Learning' },
  { id: 'user-priya', name: 'Priya Patel', college: 'NIT Trichy', role: 'Frontend & UI' },
  { id: 'user-aarav', name: 'Aarav Mehta', college: 'IIIT Hyd', role: 'DSA & Systems' },
  { id: 'user-sneha', name: 'Sneha Rao', college: 'IIT Delhi', role: 'Flutter & Mobile' },
  { id: 'user-rohan', name: 'Rohan Verma', college: 'BITS Goa', role: 'Go & Cloud' },
  { id: 'user-ananya', name: 'Ananya Gupta', college: 'DTU Delhi', role: 'Next.js & React' },
  { id: 'user-vikram', name: 'Vikram Singh', college: 'IIT Roorkee', role: 'NLP & LLMs' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchDemoUser } = useAuth();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSwitchUser = async (userId: string) => {
    await switchDemoUser(userId);
    setShowDemoMenu(false);
    router.refresh();
  };

  const streak = user?.dsaProfile?.streakCount || 0;

  return (
    <aside className="w-64 h-screen bg-[#0F0F12]/95 backdrop-blur-xl border-r border-[#27272A] flex flex-col fixed left-0 top-0 z-40 shadow-xl">
      {/* Brand Header */}
      <div className="px-5 py-6 border-b border-[#27272A]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:shadow-violet-600/30 group-hover:scale-105 transition-all duration-300">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-white tracking-tight">Team Up</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">Find your people</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          Explore
        </div>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-violet-600/15 text-violet-400 font-semibold border border-violet-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={active ? 'text-violet-400' : 'text-zinc-500'} />
                <span>{item.label}</span>
              </div>
              {item.badge && !active && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-600/15 text-violet-400 border border-violet-500/20 font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Switch Demo Account Bar */}
      <div className="px-3 pb-2">
        <div className="relative">
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 text-white text-xs font-semibold transition-all"
          >
            <div className="flex items-center gap-2">
              <Zap size={13} className="text-violet-400" />
              <span>Switch Student Demo</span>
            </div>
            <ChevronRight size={13} className={`text-zinc-500 transition-transform ${showDemoMenu ? 'rotate-90' : ''}`} />
          </button>

          {showDemoMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 max-h-60 overflow-y-auto bg-[#18181B] border border-zinc-700 rounded-2xl p-1.5 shadow-2xl z-50 divide-y divide-zinc-800">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Switch Student View:
              </div>
              {DEMO_USERS.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleSwitchUser(u.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-zinc-800 rounded-xl text-left transition-colors ${
                    user?.id === u.id ? 'bg-violet-600/10 border border-violet-500/20' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                    {u.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold truncate ${user?.id === u.id ? 'text-violet-400' : 'text-white'}`}>
                      {u.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate">{u.college} · {u.role}</p>
                  </div>
                  {user?.id === u.id && <span className="w-2 h-2 rounded-full bg-violet-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Card & Sign Out */}
      <div className="px-3 pb-4 border-t border-zinc-800 pt-3">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-800/50 transition-colors group mb-1.5"
        >
          <div className="relative">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                loading="lazy"
                decoding="async"
                width={36}
                height={36}
                className="w-9 h-9 rounded-lg object-cover ring-2 ring-zinc-700 group-hover:ring-violet-500/30 transition-all"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                {user?.name?.[0] || '?'}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#0F0F12]" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate group-hover:text-violet-400 transition-colors">
              {user?.name || 'Loading...'}
            </p>
            <p className="text-[11px] text-zinc-500 truncate">{user?.college || 'Student'}</p>
          </div>

          {streak > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-lg border border-amber-500/20">
              <Flame size={11} className="text-amber-400 fill-amber-400" />
              {streak}
            </span>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800/50 transition-all text-xs font-medium"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
