'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../services/api';
import { User, MatchResult } from '../../../types';
import StudentCard from '../../../components/StudentCard';
import { Search, SlidersHorizontal, X, Sparkles, Users } from 'lucide-react';

type StudentWithMatch = User & { match: MatchResult };

const YEARS = ['', '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'];
const STATUSES = ['', 'Actively Looking', 'Open to Opportunities', 'Not Looking Right Now'];

const QUICK_TAGS = [
  { label: '🔥 All Active', val: '' },
  { label: '🤖 AI / ML', val: 'Machine Learning' },
  { label: '⚛️ React / Frontend', val: 'React' },
  { label: '🐍 Python', val: 'Python' },
  { label: '🚀 Web Dev', val: 'Web' },
  { label: '☕ Java / Spring', val: 'Java' },
];

export default function ExplorePage() {
  const [students, setStudents] = useState<StudentWithMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (college) params.college = college;
      if (year) params.year = year;
      if (status) params.activityStatus = status;
      const res = await api.exploreStudents(params);
      setStudents(res.students || []);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [search, college, year, status]);

  useEffect(() => {
    const t = setTimeout(fetchStudents, 300);
    return () => clearTimeout(t);
  }, [fetchStudents]);

  const hasFilters = college || year || status;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-violet-400" />
            <span>Campus Peer Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Discover Student Peers</h1>
          <p className="text-zinc-500 text-sm">Find teammates with complementary skills for hackathons, startups & DSA</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-zinc-800/50 px-3.5 py-2 rounded-xl border border-zinc-700/50 self-start md:self-auto">
          <Users size={15} className="text-violet-400" />
          <span><strong className="text-white">{students.length}</strong> students online</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card-human rounded-2xl p-4 space-y-3">
        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by student name, college, skills (e.g. Python, React, BITS)..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 text-sm font-medium transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
              hasFilters
                ? 'bg-violet-600 border-violet-600 text-white'
                : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {hasFilters && <span className="w-2 h-2 rounded-full bg-amber-400 ml-0.5" />}
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-zinc-500 mr-1">Quick search:</span>
          {QUICK_TAGS.map(tag => (
            <button
              key={tag.label}
              onClick={() => setSearch(tag.val)}
              className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                search === tag.val
                  ? 'bg-violet-600 border-violet-600 text-white font-semibold'
                  : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="pt-3 border-t border-zinc-700/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                College / University
              </label>
              <input
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="e.g. IIT Bombay, BITS..."
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-violet-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Year of Study
              </label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none focus:border-violet-500 font-medium"
              >
                {YEARS.map(y => <option key={y} value={y}>{y || 'All Years'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Activity Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs focus:outline-none focus:border-violet-500 font-medium"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s || 'All Activity Levels'}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Student Cards */}
      {loading && students.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-zinc-800/50 rounded-2xl animate-pulse border border-zinc-700/50" />
          ))}
        </div>
      ) : students.length > 0 ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
          {students.map(s => (
            <StudentCard key={s.id} student={s} match={s.match} />
          ))}
        </div>
      ) : (
        <div className="card-human rounded-2xl p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto">
            <Users size={28} />
          </div>
          <h3 className="text-lg font-bold text-white">No students matched your search</h3>
          <p className="text-zinc-500 text-xs max-w-sm mx-auto">
            Try adjusting your search keywords, clear the college filter, or check back later.
          </p>
          <button
            onClick={() => { setSearch(''); setCollege(''); setYear(''); setStatus(''); }}
            className="btn-creative px-4 py-2 text-white rounded-xl text-xs font-semibold transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
