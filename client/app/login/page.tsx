'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, GraduationCap, Flame, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login, switchDemoUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (userId: string) => {
    setLoading(true);
    setError('');
    try {
      await switchDemoUser(userId);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to switch demo account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative">
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Community Showcase */}
        <div className="hidden lg:block lg:col-span-6 space-y-6 pr-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 border-2 border-[#FF6B35]/30 text-[#FF6B35] text-xs font-semibold">
            <Sparkles size={14} className="text-[#FF6B35]" />
            <span>Campus Collaboration Network</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-[#2D2A26] tracking-tight leading-tight">
            Stop coding alone. <br />
            <span className="text-gradient">
              Build with peers.
            </span>
          </h1>

          <p className="text-[#8B8680] text-base leading-relaxed">
            Team Up matches you with students across top universities based on complementary skills, hackathon goals, and daily DSA practice.
          </p>

          <div className="space-y-3.5 pt-2">
            {[
              { icon: GraduationCap, text: 'Verified student profiles from top tech universities' },
              { icon: Flame, text: 'DSA buddy matching with daily LeetCode accountability' },
              { icon: CheckCircle2, text: 'Real-time direct messaging and team recruitment' },
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-[#2D2A26] font-medium">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 border-2 border-[#FF6B35]/30 flex items-center justify-center text-[#FF6B35] flex-shrink-0">
                  <feat.icon size={16} />
                </div>
                <span>{feat.text}</span>
              </div>
            ))}
          </div>

          {/* Social proof avatar pill */}
          <div className="pt-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
              ].map((src, i) => (
                <img key={i} src={src} alt="student" className="w-8 h-8 rounded-full object-cover ring-2 ring-white" />
              ))}
            </div>
            <p className="text-xs text-[#8B8680] font-medium">
              Joined by students from <span className="text-[#2D2A26] font-bold">IITs, BITS, NITs & IIITs</span>
            </p>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border-2 border-[#FDF2D8] relative">
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-[#FF6B35] to-[#4ECDC4] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
                <Users size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2D2A26]">Welcome back</h2>
                <p className="text-xs text-[#8B8680] font-medium">Sign in to your student workspace</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8B8680] uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B8680]" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ansh@iitb.ac.in"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9ED] border-2 border-[#FDF2D8] rounded-xl text-[#2D2A26] placeholder-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8B8680] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B8680]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FFF9ED] border-2 border-[#FDF2D8] rounded-xl text-[#2D2A26] placeholder-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B8680] hover:text-[#FF6B35]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-creative w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-xl shadow-lg shadow-[#FF6B35]/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Quick Demo Switcher Grid */}
            <div className="mt-6 pt-5 border-t-2 border-[#FDF2D8]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-[#8B8680] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} className="text-[#FF6B35]" /> 1-Click Demo Profiles
                </span>
                <span className="text-[10px] text-[#8B8680] font-medium">Click to login</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'user-anshk', name: 'Ansh Kumar', college: 'IIT Bombay', badge: 'Full Stack' },
                  { id: 'user-rahul', name: 'Rahul Sharma', college: 'BITS Pilani', badge: 'AI / CV' },
                  { id: 'user-priya', name: 'Priya Patel', college: 'NIT Trichy', badge: 'Frontend' },
                  { id: 'user-aarav', name: 'Aarav Mehta', college: 'IIIT Hyd', badge: 'DSA / Sys' },
                ].map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleDemo(u.id)}
                    className="p-2.5 bg-[#FFF9ED] hover:bg-[#FFE9CC] border-2 border-[#FDF2D8] hover:border-[#FF6B35]/30 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[#2D2A26] text-xs font-bold truncate group-hover:text-[#FF6B35]">{u.name}</p>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 text-[#FF6B35] font-bold border-2 border-[#FF6B35]/30">{u.badge}</span>
                    </div>
                    <p className="text-[#8B8680] text-[10px] truncate mt-0.5">{u.college}</p>
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-[#8B8680]">
              Don't have an account yet?{' '}
              <Link href="/register" className="text-[#FF6B35] hover:text-[#FF8C42] font-bold underline underline-offset-2">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


