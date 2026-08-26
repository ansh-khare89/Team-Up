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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-indigo-600" />
            <span>Campus Peer Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Discover Student Peers</h1>
          <p className="text-slate-500 text-sm">Find teammates with complementary skills for hackathons, startups & DSA</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 self-start md:self-auto shadow-sm">
          <Users size={15} className="text-indigo-600" />
          <span><strong className="text-slate-900">{students.length}</strong> students online</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card-human rounded-2xl p-4 shadow-sm space-y-3 bg-white border border-slate-200">
        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by student name, college, skills (e.g. Python, React, BITS)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm font-medium transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
              hasFilters
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {hasFilters && <span className="w-2 h-2 rounded-full bg-amber-400 ml-0.5" />}
          </button>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 mr-1">Quick search:</span>
          {QUICK_TAGS.map(tag => (
            <button
              key={tag.label}
              onClick={() => setSearch(tag.val)}
              className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                search === tag.val
                  ? 'bg-indigo-600 border-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                College / University
              </label>
              <input
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="e.g. IIT Bombay, BITS..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Year of Study
              </label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
              >
                {YEARS.map(y => <option key={y} value={y}>{y || 'All Years'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Activity Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s || 'All Activity Levels'}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Student Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-slate-200 shadow-sm" />
          ))}
        </div>
      ) : students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map(s => (
            <StudentCard key={s.id} student={s} match={s.match} />
          ))}
        </div>
      ) : (
        <div className="card-human rounded-3xl p-12 text-center space-y-3 bg-white border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Users size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No students matched your search</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Try adjusting your search keywords, clear the college filter, or check back later.
          </p>
          <button
            onClick={() => { setSearch(''); setCollege(''); setYear(''); setStatus(''); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

