'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', college: 'IIT Bombay', branch: 'Computer Science' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative">
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#4ECDC4] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
              <Users size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black text-[#2D2A26] tracking-tight">Team Up</span>
          </div>
          <p className="text-[#8B8680] text-sm font-medium">Join the network where top student builders connect.</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border-2 border-[#FDF2D8]">
          <h1 className="text-2xl font-bold text-[#2D2A26] mb-1">Create Student Account</h1>
          <p className="text-[#8B8680] text-xs mb-6 font-medium">Takes less than 30 seconds to join your campus peers</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#8B8680] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B8680]" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Arjun Sharma"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9ED] border-2 border-[#FDF2D8] rounded-xl text-[#2D2A26] placeholder-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8B8680] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B8680]" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="arjun@iitb.ac.in"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9ED] border-2 border-[#FDF2D8] rounded-xl text-[#2D2A26] placeholder-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#8B8680] uppercase tracking-wider mb-1.5">
                  University / College
                </label>
                <input
                  type="text"
                  value={form.college}
                  onChange={e => setForm({ ...form, college: e.target.value })}
                  placeholder="IIT Bombay"
                  required
                  className="w-full px-3 py-2.5 bg-[#FFF9ED] border-2 border-[#FDF2D8] rounded-xl text-[#2D2A26] text-xs placeholder-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8B8680] uppercase tracking-wider mb-1.5">
                  Major / Branch
                </label>
                <input
                  type="text"
                  value={form.branch}
                  onChange={e => setForm({ ...form, branch: e.target.value })}
                  placeholder="Computer Science"
                  required
                  className="w-full px-3 py-2.5 bg-[#FFF9ED] border-2 border-[#FDF2D8] rounded-xl text-[#2D2A26] text-xs placeholder-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white font-medium"
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
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
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
                <>Get Started <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-[#8B8680]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF6B35] hover:text-[#FF8C42] font-bold underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


