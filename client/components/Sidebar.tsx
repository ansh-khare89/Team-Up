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
  UserCircle,
  LogOut,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/connections', label: 'Connections', icon: Users },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/dsa', label: 'DSA Partner', icon: Code2 },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

const DEMO_USERS = [
  { id: 'user-anshk', name: 'Ansh Kumar', college: 'IIT Bombay' },
  { id: 'user-rahul', name: 'Rahul Sharma', college: 'BITS Pilani' },
  { id: 'user-priya', name: 'Priya Patel', college: 'NIT Trichy' },
  { id: 'user-aarav', name: 'Aarav Mehta', college: 'IIIT Hyd' },
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

  return (
    <aside className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
            <Users size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">Team Up</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}>
              <item.icon size={18} className={active ? 'text-indigo-400' : 'text-slate-500'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Demo switcher */}
      <div className="px-3 pb-2">
        <div className="relative">
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-xs font-medium transition-all"
          >
            <Zap size={13} />
            <span>Switch Demo User</span>
            <ChevronDown size={13} className={`ml-auto transition-transform ${showDemoMenu ? 'rotate-180' : ''}`} />
          </button>
          {showDemoMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl z-50">
              {DEMO_USERS.map(u => (
                <button key={u.id} onClick={() => handleSwitchUser(u.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-700 text-left transition-colors ${user?.id === u.id ? 'bg-indigo-500/10' : ''}`}>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${user?.id === u.id ? 'text-indigo-400' : 'text-slate-200'}`}>{u.name}</p>
                    <p className="text-xs text-slate-500">{u.college}</p>
                  </div>
                  {user?.id === u.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User profile + logout */}
      <div className="px-3 pb-4 border-t border-slate-800 pt-3">
        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors group mb-1">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-indigo-500/40 transition-all" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.[0] || '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name || 'Loading...'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.college || ''}</p>
          </div>
          <UserCircle size={14} className="text-slate-600 group-hover:text-slate-400" />
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm">
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
