'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../services/api';
import { User, MatchResult } from '../../../types';
import StudentCard from '../../../components/StudentCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

type StudentWithMatch = User & { match: MatchResult };

const YEARS = ['', '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'];
const STATUSES = ['', 'Actively Looking', 'Open to Opportunities', 'Not Looking Right Now'];

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
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Explore Students</h1>
        <p className="text-slate-400">Discover students who match your interests and goals</p>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, college, or branch..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${hasFilters ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-400' : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'}`}
        >
          <SlidersHorizontal size={15} />
          Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-indigo-400 ml-1" />}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-5 p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">College</label>
            <input
              value={college}
              onChange={e => setCollege(e.target.value)}
              placeholder="Filter by college..."
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Year</label>
            <select value={year} onChange={e => setYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {YEARS.map(y => <option key={y} value={y}>{y || 'Any year'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Activity Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {STATUSES.map(s => <option key={s} value={s}>{s || 'Any status'}</option>)}
            </select>
          </div>
          {hasFilters && (
            <div className="sm:col-span-3 flex justify-end">
              <button onClick={() => { setCollege(''); setYear(''); setStatus(''); }}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <X size={12} /> Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Count */}
      <p className="text-slate-500 text-sm mb-4">{loading ? 'Searching...' : `${students.length} student${students.length !== 1 ? 's' : ''} found`}</p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-slate-800/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Search size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium text-slate-400">No students found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(s => (
            <StudentCard key={s.id} student={s} match={s.match} />
          ))}
        </div>
      )}
    </div>
  );
}
