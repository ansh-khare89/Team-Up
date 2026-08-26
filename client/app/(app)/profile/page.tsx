'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import { GoalId, Skill } from '../../../types';
import SkillBadge from '../../../components/SkillBadge';
import GoalChip from '../../../components/GoalChip';
import { Github, Linkedin, ExternalLink, Edit3, Check, X, Plus, Flame, Code2 } from 'lucide-react';

const GOAL_IDS: GoalId[] = ['dsa_partner', 'project_collaborator', 'hackathon_teammate', 'internship_prep', 'mock_interview', 'open_source', 'learn_tech'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const ACTIVITY_STATUSES = ['Actively Looking', 'Open to Opportunities', 'Not Looking Right Now'];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [bio, setBio] = useState(user?.bio || '');
  const [activityStatus, setActivityStatus] = useState(user?.activityStatus || 'Actively Looking');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [portfolio, setPortfolio] = useState(user?.portfolio || '');
  const [leetcode, setLeetcode] = useState(user?.leetcode || '');

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [skills, setSkills] = useState<Skill[]>(user?.skills || []);
  const [goals, setGoals] = useState<GoalId[]>((user?.currentGoals as GoalId[]) || []);

  const startEdit = () => {
    setBio(user?.bio || '');
    setActivityStatus(user?.activityStatus || 'Actively Looking');
    setGithub(user?.github || '');
    setLinkedin(user?.linkedin || '');
    setPortfolio(user?.portfolio || '');
    setLeetcode(user?.leetcode || '');
    setSkills(user?.skills || []);
    setGoals((user?.currentGoals as GoalId[]) || []);
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.updateProfile({
        bio,
        activityStatus: activityStatus as any,
        github,
        linkedin,
        portfolio,
        leetcode,
        skills: skills as any,
        currentGoals: goals,
      });
      updateUser(res.user || { bio, activityStatus: activityStatus as any, github, linkedin, portfolio, leetcode, skills, currentGoals: goals });
      setEditing(false);
    } catch {} finally { setSaving(false); }
  };

  const addSkill = () => {
    if (!newSkillName.trim() || skills.find(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) return;
    setSkills([...skills, { name: newSkillName.trim(), level: newSkillLevel as any, category: 'Other Technical Skills' }]);
    setNewSkillName('');
  };

  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));

  const toggleGoal = (g: GoalId) => setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  if (!user) return null;

  const statusStyle: Record<string, string> = {
    'Actively Looking': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    'Open to Opportunities': 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    'Not Looking Right Now': 'bg-slate-700 text-slate-400 border-slate-600',
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">My Profile</h1>
          <p className="text-slate-400">Manage your public profile and preferences</p>
        </div>
        {!editing ? (
          <button onClick={startEdit}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-slate-200 rounded-xl text-sm font-medium transition-all">
            <Edit3 size={15} />Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={cancelEdit}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm font-medium transition-colors">
              <X size={14} />Cancel
            </button>
            <button onClick={saveProfile} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg shadow-indigo-500/25">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={14} />Save Changes</>}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Avatar + identity */}
        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 text-center">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 ring-2 ring-slate-700" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                {user.name[0]}
              </div>
            )}
            <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-slate-400 text-sm">{user.email}</p>
            <p className="text-slate-500 text-sm">{user.college}</p>
            <p className="text-slate-500 text-sm">{user.branch} · {user.yearOfStudy}</p>
            <div className="mt-3">
              {!editing ? (
                <span className={`inline-block text-xs px-3 py-1 rounded-full border ${statusStyle[user.activityStatus] || statusStyle['Not Looking Right Now']}`}>
                  {user.activityStatus}
                </span>
              ) : (
                <select value={activityStatus} onChange={e => setActivityStatus(e.target.value as any)}
                  className="w-full mt-2 px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {ACTIVITY_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              )}
            </div>
          </div>

          {/* Social links */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Social Links</h3>
            {!editing ? (
              <div className="space-y-2">
                {[
                  { icon: Github, label: 'GitHub', val: user.github, href: user.github },
                  { icon: Linkedin, label: 'LinkedIn', val: user.linkedin, href: user.linkedin },
                  { icon: ExternalLink, label: 'Portfolio', val: user.portfolio, href: user.portfolio },
                  { icon: Code2, label: 'LeetCode', val: user.leetcode, href: user.leetcode },
                ].filter(l => l.val).map(l => (
                  <a key={l.label} href={l.href!} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 text-sm transition-colors">
                    <l.icon size={14} />{l.label}
                  </a>
                ))}
                {!user.github && !user.linkedin && !user.portfolio && !user.leetcode && (
                  <p className="text-slate-600 text-sm">No links added yet</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  { icon: Github, label: 'GitHub', val: github, set: setGithub, ph: 'https://github.com/username' },
                  { icon: Linkedin, label: 'LinkedIn', val: linkedin, set: setLinkedin, ph: 'https://linkedin.com/in/username' },
                  { icon: ExternalLink, label: 'Portfolio', val: portfolio, set: setPortfolio, ph: 'https://yoursite.dev' },
                  { icon: Code2, label: 'LeetCode', val: leetcode, set: setLeetcode, ph: 'https://leetcode.com/username' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-2">
                    <l.icon size={13} className="text-slate-500 flex-shrink-0" />
                    <input value={l.val} onChange={e => l.set(e.target.value)} placeholder={l.ph}
                      className="flex-1 px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DSA Profile */}
          {user.dsaProfile && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Flame size={14} className="text-orange-400" />DSA Profile
              </h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Platform</span><span className="text-white">{user.dsaProfile.platform}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Streak</span><span className="text-orange-400 font-bold">{user.dsaProfile.streakCount} 🔥</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Daily goal</span><span className="text-white">{user.dsaProfile.dailyGoal} problems</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Editable sections */}
        <div className="lg:col-span-2 space-y-5">
          {/* Bio */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">About Me</h3>
            {!editing ? (
              <p className="text-slate-300 text-sm leading-relaxed">{user.bio || <span className="text-slate-600">No bio yet. Click Edit Profile to add one.</span>}</p>
            ) : (
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                placeholder="Tell other students about yourself..."
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none" />
            )}
          </div>

          {/* Skills */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Skills</h3>
            {editing && (
              <div className="flex gap-2 mb-3">
                <input value={newSkillName} onChange={e => setNewSkillName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill..."
                  className="flex-1 px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <select value={newSkillLevel} onChange={e => setNewSkillLevel(e.target.value)}
                  className="px-2 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {SKILL_LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
                <button onClick={addSkill}
                  className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors">
                  <Plus size={16} />
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <div key={i} className="group relative inline-flex">
                  <SkillBadge skill={s} />
                  {editing && (
                    <button onClick={() => removeSkill(i)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={9} />
                    </button>
                  )}
                </div>
              ))}
              {skills.length === 0 && <p className="text-slate-600 text-sm">No skills added yet</p>}
            </div>
          </div>

          {/* Goals */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Looking For</h3>
            <div className="flex flex-wrap gap-2">
              {GOAL_IDS.map(g => (
                <div key={g} onClick={() => editing && toggleGoal(g)}>
                  <GoalChip goalId={g} selected={goals.includes(g)} onClick={editing ? () => toggleGoal(g) : undefined} />
                </div>
              ))}
            </div>
            {!editing && goals.length === 0 && (
              <p className="text-slate-600 text-sm">No goals set. Edit your profile to add some.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
