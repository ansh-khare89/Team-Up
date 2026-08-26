'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Opportunity } from '../../../types';
import { Briefcase, Plus, Star, X, Code2, Sparkles } from 'lucide-react';

const CATEGORIES = ['Hackathon', 'Open Source', 'DSA Study Group', 'Project', 'Research', 'Other'];

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Hackathon', skills: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getOpportunities().then(res => setOpportunities(res.opportunities || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleInterest = async (opp: Opportunity) => {
    try {
      const res = await api.toggleOpportunityInterest(opp.id);
      setOpportunities(prev => prev.map(o => o.id === opp.id ? res.opportunity : o));
    } catch {}
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      const res = await api.createOpportunity({ ...form, requiredSkills: skills });
      setOpportunities(prev => [res.opportunity, ...prev]);
      setForm({ title: '', description: '', category: 'Hackathon', skills: '' });
      setShowForm(false);
    } catch {} finally { setSubmitting(false); }
  };

  const CATEGORY_COLORS: Record<string, string> = {
    'Hackathon':       'bg-amber-50  text-amber-700  border-amber-200',
    'Open Source':     'bg-teal-50   text-teal-700   border-teal-200',
    'DSA Study Group': 'bg-violet-50 text-violet-700 border-violet-200',
    'Project':         'bg-blue-50   text-blue-700   border-blue-200',
    'Research':        'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Other':           'bg-slate-100 text-slate-700  border-slate-200',
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-indigo-600" />
            <span>Collaboration Board</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Team Openings & Projects</h1>
          <p className="text-slate-500 text-sm">Find projects looking for your skills or recruit teammates for your next build</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all">
          <Plus size={16} />Post Opening
        </button>
      </div>

      {/* Post form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">Post Team Opening</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="e.g. 🚀 Building an AI Campus Assistant for Smart India Hackathon"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  rows={3} placeholder="What are you building, what roles are open, and what is your timeline?"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-sm font-medium resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Required Skills</label>
                  <input value={form.skills} onChange={e => setForm({...form, skills: e.target.value})}
                    placeholder="React, Python, Tailwind..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white text-xs font-medium" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={submitting || !form.title.trim()}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm disabled:opacity-50 transition-all">
                  {submitting ? 'Posting...' : 'Post Opportunity'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Opportunities list */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-slate-200" />)}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="card-human bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
          <Briefcase size={40} className="mx-auto mb-3 text-slate-400" />
          <p className="text-slate-900 font-bold text-base">No active openings yet</p>
          <p className="text-xs text-slate-500 mt-1">Be the first to post a hackathon or side project team opening!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map(opp => (
            <div key={opp.id} className="card-human bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${CATEGORY_COLORS[opp.category] || CATEGORY_COLORS['Other']}`}>
                      {opp.category}
                    </span>
                    {opp.creator && (
                      <span className="text-slate-500 text-xs font-medium">posted by <strong className="text-slate-800">{opp.creator.name}</strong> · {opp.creator.college}</span>
                    )}
                  </div>
                  <h3 className="text-slate-900 font-bold text-base mb-2">{opp.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-3">{opp.description}</p>
                  {opp.requiredSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {opp.requiredSkills.map(skill => (
                        <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                          <Code2 size={11} className="text-indigo-600" />{skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button onClick={() => handleInterest(opp)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      opp.isInterested
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:text-amber-700'
                    }`}>
                    {opp.isInterested ? <Star size={13} fill="currentColor" className="text-amber-500" /> : <Star size={13} />}
                    {opp.isInterested ? 'Interested' : 'Express Interest'}
                  </button>
                  {opp.interestedUsers && opp.interestedUsers.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        {opp.interestedUsers.slice(0, 3).map(u => (
                          u.profilePicture
                            ? <img key={u.id} src={u.profilePicture} alt={u.name} className="w-5 h-5 rounded-full ring-1 ring-white object-cover" />
                            : <div key={u.id} className="w-5 h-5 rounded-full ring-1 ring-white bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">{u.name[0]}</div>
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{opp.interestedUsers.length} interested</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

