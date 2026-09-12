'use client';

import { useEffect, useState, Suspense } from 'react';
import { api } from '../../../services/api';
import { Opportunity } from '../../../types';
import { Briefcase, Plus, Star, X, Code2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['Hackathon', 'Open Source', 'DSA Study Group', 'Project', 'Research', 'Other'];

function OpportunitiesContent() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Hackathon', skills: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .getOpportunities()
      .then(res => setOpportunities(res.opportunities || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleInterest = async (opp: Opportunity) => {
    try {
      const res = await api.toggleOpportunityInterest(opp.id);
      setOpportunities(prev => prev.map(o => (o.id === opp.id ? res.opportunity : o)));
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

  // Framer Motion variants for staggered slide‑in
  const listVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 }
    })
  };

  // Category badge colors (dark‑theme friendly)
  const CATEGORY_COLORS: Record<string, string> = {
    Hackathon: 'bg-amber-100 text-amber-800 border-amber-300',
    'Open Source': 'bg-teal-100 text-teal-800 border-teal-300',
    'DSA Study Group': 'bg-violet-100 text-violet-800 border-violet-300',
    Project: 'bg-blue-100 text-blue-800 border-blue-300',
    Research: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Other: 'bg-slate-200 text-slate-800 border-slate-300',
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6 bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-indigo-600" />
            <span>Collaboration Board</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight mb-1">Team Openings & Projects</h1>
          <p className="text-zinc-400 text-sm">Find projects looking for your skills or recruit teammates for your next build</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus size={16} />Post Opening
        </button>
      </div>

      {/* Post form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-[#09090B]/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181B]/95 border border-zinc-700 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-zinc-100">Post Team Opening</h2>
              <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-zinc-200">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="🚀 Building an AI Campus Assistant for Smart India Hackathon"
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="What are you building, what roles are open, and what is your timeline?"
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">Required Skills</label>
                  <input
                    value={form.skills}
                    onChange={e => setForm({ ...form, skills: e.target.value })}
                    placeholder="React, Python, Tailwind..."
                    className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs font-medium"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !form.title.trim()}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-7 00 text-white rounded-xl text-xs font-semibold shadow-sm disabled:opacity-50 transition-all"
                >
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
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-zinc-800 rounded-2xl animate-pulse border border-zinc-700" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="card-human bg-zinc-800 border-zinc-700 text-center text-zinc-400 p-12">
          <Briefcase size={40} className="mx-auto mb-3 text-zinc-500" />
          <p className="text-zinc-200 font-bold text-base">No active openings yet</p>
          <p className="text-xs text-zinc-500 mt-1">Be the first to post a hackathon or side‑project team opening!</p>
        </div>
      ) : (
        <motion.div className="space-y-4" initial="hidden" animate="visible">
          {opportunities.map((opp, idx) => (
            <motion.div
              key={opp.id}
              custom={idx}
              variants={listVariant}
              className="card-human bg-zinc-800 border-zinc-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${CATEGORY_COLORS[opp.category] || CATEGORY_COLORS['Other']}`}> {opp.category} </span>
                    {opp.creator && (
                      <span className="text-zinc-500 text-xs font-medium">
                        posted by <strong className="text-zinc-200">{opp.creator.name}</strong> · {opp.creator.college}
                      </span>
                    )}
                  </div>
                  <h3 className="text-zinc-100 font-bold text-base mb-2">{opp.title}</h3>
                  <p className="text-zinc-300 text-xs leading-relaxed mb-3">{opp.description}</p>
                  {opp.requiredSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {opp.requiredSkills.map(skill => (
                        <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-700 border border-zinc-600 rounded-lg text-xs font-medium text-zinc-200">
                          <Code2 size={11} className="text-indigo-600" />{skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleInterest(opp)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${opp.isInterested
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-zinc-700 text-zinc-200 border-zinc-600 hover:border-amber-400 hover:text-amber-700'}
                    `}
                  >
                    {opp.isInterested ? <Star size={13} fill="currentColor" className="text-amber-500" /> : <Star size={13} />}
                    {opp.isInterested ? 'Interested' : 'Express Interest'}
                  </button>
                  {opp.interestedUsers && opp.interestedUsers.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        {opp.interestedUsers.slice(0, 3).map(u => (
                          u.profilePicture ? (
                            <img key={u.id} src={u.profilePicture} alt={u.name} loading="lazy" decoding="async" width={20} height={20} className="w-5 h-5 rounded-full ring-1 ring-zinc-800 object-cover" />
                          ) : (
                            <div key={u.id} className="w-5 h-5 rounded-full ring-1 ring-zinc-800 bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                              {u.name[0]}
                            </div>
                          )
                        ))}
                      </div>
                      <span className="text-[11px] text-zinc-500 font-medium">{opp.interestedUsers.length} interested</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-zinc-500">Loading opportunities…</div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
