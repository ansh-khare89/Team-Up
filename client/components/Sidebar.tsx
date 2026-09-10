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
  Sparkles,
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
    <aside className="w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-orange-100 flex flex-col fixed left-0 top-0 z-40 shadow-[4px_0_24px_rgba(234,88,12,0.08)]">
      {/* Brand Header */}
      <div className="px-5 py-6 border-b border-orange-50">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <Users size={21} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-gradient tracking-tight">Team Up</span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Find your people</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
          Explore
        </div>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 font-semibold border border-orange-200 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-orange-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={active ? 'text-orange-600' : 'text-stone-400 group-hover:text-orange-500'} />
                <span>{item.label}</span>
              </div>
              {item.badge && !active && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200 font-medium">
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
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-orange-200 text-stone-700 text-xs font-semibold transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Zap size={13} className="text-orange-500" />
              <span>Switch Student Demo</span>
            </div>
            <ChevronRight size={13} className={`text-stone-400 transition-transform ${showDemoMenu ? 'rotate-90' : ''}`} />
          </button>

          {showDemoMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 max-h-60 overflow-y-auto bg-white border border-orange-200 rounded-2xl p-1.5 shadow-xl z-50 divide-y divide-orange-50">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Switch Student View:
              </div>
              {DEMO_USERS.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleSwitchUser(u.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-orange-50 rounded-xl text-left transition-colors ${
                    user?.id === u.id ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                    {u.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold truncate ${user?.id === u.id ? 'text-orange-700' : 'text-stone-800'}`}>
                      {u.name}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">{u.college} · {u.role}</p>
                  </div>
                  {user?.id === u.id && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Card & Sign Out */}
      <div className="px-3 pb-4 border-t border-orange-50 pt-3">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-orange-50/50 transition-colors group mb-1.5"
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
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-orange-100 group-hover:ring-orange-300 transition-all"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-sm font-bold text-white">
                {user?.name?.[0] || '?'}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-stone-900 truncate group-hover:text-orange-600 transition-colors">
              {user?.name || 'Loading...'}
            </p>
            <p className="text-[11px] text-stone-500 truncate">{user?.college || 'Student'}</p>
          </div>

          {streak > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-orange-600 bg-gradient-to-r from-orange-50 to-amber-50 px-1.5 py-0.5 rounded-lg border border-orange-200">
              <Flame size={11} className="text-orange-500 fill-orange-500" />
              {streak}
            </span>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs font-medium"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}


