'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Opportunity } from '../../../types';
import { Briefcase, Plus, Star, StarOff, X, Tag, Code2 } from 'lucide-react';

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
    'Hackathon':       'bg-amber-500/15 text-amber-400 border-amber-500/25',
    'Open Source':     'bg-teal-500/15  text-teal-400  border-teal-500/25',
    'DSA Study Group': 'bg-violet-500/15 text-violet-400 border-violet-500/25',
    'Project':         'bg-blue-500/15  text-blue-400  border-blue-500/25',
    'Research':        'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    'Other':           'bg-slate-700    text-slate-400  border-slate-600',
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Opportunities</h1>
          <p className="text-slate-400">Find collaborators or post your own opportunity</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all">
          <Plus size={16} />Post
        </button>
      </div>

      {/* Post form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Post an Opportunity</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="e.g. 🚀 Building an AI Campus Assistant"
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  rows={3} placeholder="What are you building and who are you looking for?"
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-3 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Required Skills</label>
                  <input value={form.skills} onChange={e => setForm({...form, skills: e.target.value})}
                    placeholder="React, Python, DSA..."
                    className="w-full px-3 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm font-medium">Cancel</button>
                <button onClick={handleSubmit} disabled={submitting || !form.title.trim()}
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
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
          {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-800/40 rounded-2xl animate-pulse" />)}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Briefcase size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-slate-400 font-medium">No opportunities yet</p>
          <p className="text-sm">Be the first to post one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map(opp => (
            <div key={opp.id} className="bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-5 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${CATEGORY_COLORS[opp.category] || CATEGORY_COLORS['Other']}`}>
                      {opp.category}
                    </span>
                    {opp.creator && (
                      <span className="text-slate-500 text-xs">by {opp.creator.name} · {opp.creator.college}</span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{opp.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">{opp.description}</p>
                  {opp.requiredSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {opp.requiredSkills.map(skill => (
                        <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-700/60 border border-slate-600 rounded-lg text-xs text-slate-300">
                          <Code2 size={11} className="text-slate-500" />{skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button onClick={() => handleInterest(opp)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      opp.isInterested
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                        : 'bg-slate-700/60 text-slate-400 border-slate-600 hover:border-amber-500/40 hover:text-amber-400'
                    }`}>
                    {opp.isInterested ? <Star size={14} fill="currentColor" /> : <Star size={14} />}
                    {opp.isInterested ? 'Interested' : 'Express Interest'}
                  </button>
                  {opp.interestedUsers && opp.interestedUsers.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        {opp.interestedUsers.slice(0, 3).map(u => (
                          u.profilePicture
                            ? <img key={u.id} src={u.profilePicture} alt={u.name} className="w-5 h-5 rounded-full ring-1 ring-slate-800 object-cover" />
                            : <div key={u.id} className="w-5 h-5 rounded-full ring-1 ring-slate-800 bg-indigo-500 flex items-center justify-center text-xs text-white">{u.name[0]}</div>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">{opp.interestedUsers.length} interested</span>
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
