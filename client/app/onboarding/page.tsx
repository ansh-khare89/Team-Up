'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { GoalId } from '../../types';
import { CheckCircle, ChevronRight, ChevronLeft, GraduationCap, Code2, Target, Plus, X, Users, Sparkles, CheckCircle as CheckCircleIcon, ArrowRight } from 'lucide-react';

const GOAL_OPTIONS: { id: GoalId; label: string; emoji: string; desc: string }[] = [
  { id: 'dsa_partner', label: 'DSA Partner', emoji: '🧠', desc: 'Daily problem solving buddy' },
  { id: 'project_collaborator', label: 'Project Collaborator', emoji: '🚀', desc: 'Build side projects together' },
  { id: 'hackathon_teammate', label: 'Hackathon Teammate', emoji: '⚡', desc: 'Win hackathons as a team' },
  { id: 'internship_prep', label: 'Internship Prep', emoji: '💼', desc: 'Crack placements together' },
  { id: 'mock_interview', label: 'Mock Interviews', emoji: '🎯', desc: 'Practice technical interviews' },
  { id: 'open_source', label: 'Open Source', emoji: '🌐', desc: 'Contribute to OSS projects' },
  { id: 'learn_tech', label: 'Learn New Tech', emoji: '📚', desc: 'Study a new technology' },
];

const SKILL_CATEGORIES = [
  'Programming Languages',
  'Web Development',
  'AI / Machine Learning',
  'Mobile Development',
  'DevOps / Cloud',
  'Problem Solving',
  'Other Technical Skills',
];

const COMMON_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'Go', 'React', 'Next.js', 'Node.js', 'Vue.js', 'Machine Learning',
  'Deep Learning', 'Data Science', 'Flutter', 'React Native', 'Docker', 'Kubernetes', 'AWS', 'DSA', 'Competitive Programming',
  'UI/UX', 'Spring Boot', 'FastAPI', 'GraphQL', 'PostgreSQL', 'MongoDB',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = ['Morning (6 AM - 12 PM)', 'Afternoon (12 PM - 6 PM)', 'Evening (6 PM - 10 PM)', 'Night (8 PM - 12 AM)', 'Flexible'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Alumni'];

export default function OnboardingPage() {
  const { updateUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: College info
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');
  const [activityStatus, setActivityStatus] = useState('Actively Looking');

  // Step 2: Skills
  const [skills, setSkills] = useState<{ name: string; category: string; level: string }[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillCategory, setSkillCategory] = useState(SKILL_CATEGORIES[0]);
  const [skillLevel, setSkillLevel] = useState('Intermediate');

  // Step 3: Goals & Availability
  const [selectedGoals, setSelectedGoals] = useState<GoalId[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [availabilityTime, setAvailabilityTime] = useState('');

  const addSkill = (name: string) => {
    const nm = name.trim();
    if (!nm || skills.find(s => s.name.toLowerCase() === nm.toLowerCase())) return;
    setSkills([...skills, { name: nm, category: skillCategory, level: skillLevel }]);
    setSkillInput('');
  };

  const removeSkill = (idx: number) => setSkills(skills.filter((_, i) => i !== idx));
  const toggleGoal = (g: GoalId) => setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  const toggleDay = (d: string) => setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.completeOnboarding({
        college,
        branch,
        yearOfStudy: year,
        bio,
        activityStatus: activityStatus as any,
        skills: skills as any,
        currentGoals: selectedGoals,
        availabilityDays: selectedDays,
        availabilityTime,
      });
      updateUser(res.user);
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const levelBadge = (level: string) => {
    if (level === 'Advanced') return 'bg-emerald-500/20 text-emerald-400 border-emerald-400';
    if (level === 'Intermediate') return 'bg-violet-500/20 text-violet-400 border-violet-400';
    return 'bg-zinc-700 text-zinc-300 border-zinc-600';
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-2xl z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-violet-400" />
            <span>Setup Your Profile</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {step === 1 && '🎓 Tell us about yourself'}
            {step === 2 && '💡 What are your skills?'}
            {step === 3 && '🎯 What are you looking for?'}
          </h1>
          <p className="text-zinc-500 text-sm">Step {step} of 3</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 justify-center mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'bg-violet-500 w-16' : 'bg-zinc-700 w-8'}`} />
          ))}
        </div>

        <div className="bg-[#18181B]/95 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800 shadow-2xl relative">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">College / University</label>
                  <input
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    placeholder="e.g. IIT Bombay"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Branch / Major</label>
                  <input
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Year of Study</label>
                  <select
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="">Select Year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Activity Status</label>
                  <select
                    value={activityStatus}
                    onChange={e => setActivityStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    {['Actively Looking', 'Open to Opportunities', 'Not Looking Right Now'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Bio (optional)</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell other students about yourself..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 text-sm resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Add a skill</label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill(skillInput)}
                    placeholder="e.g. React, Python, DSA..."
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 text-sm"
                  />
                  <select
                    value={skillLevel}
                    onChange={e => setSkillLevel(e.target.value)}
                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <button
                    onClick={() => addSkill(skillInput)}
                    className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {SKILL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSkillCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs border-2 ${skillCategory === cat ? 'bg-violet-600 border-violet-600 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div>
                <p className="text-xs text-zinc-400 mb-2">Quick add popular skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SKILLS.filter(s => !skills.find(sk => sk.name === s)).slice(0, 14).map(s => (
                    <button
                      key={s}
                      onClick={() => addSkill(s)}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-700 rounded-lg text-xs text-white hover:text-violet-400"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {skills.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-400 mb-2">Your skills ({skills.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-medium ${levelBadge(s.level)}`}>
                        {s.name}
                        <span className="opacity-70">· {s.level}</span>
                        <button onClick={() => removeSkill(i)} className="ml-1 opacity-50 hover:opacity-100">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <p className="block text-xs font-bold text-zinc-400 uppercase mb-2">What are you looking for? (select all that apply)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GOAL_OPTIONS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => toggleGoal(g.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${selectedGoals.includes(g.id) ? 'bg-violet-600 border-violet-600 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-violet-500'}`}
                    >
                      <span className="text-xl">{g.emoji}</span>
                      <div>
                        <p className="text-sm font-medium">{g.label}</p>
                        <p className="text-xs text-zinc-300">{g.desc}</p>
                      </div>
                      {selectedGoals.includes(g.id) && <CheckCircleIcon size={16} className="ml-auto mt-0.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Availability days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(d => (
                    <button
                      key={d}
                      onClick={() => toggleDay(d)}
                      className={`px-3 py-1.5 rounded-lg text-sm border-2 ${selectedDays.includes(d) ? 'bg-violet-600 border-violet-600 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-violet-500'}`}
                    >
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Preferred time</label>
                <div className="flex flex-wrap gap-2">
                  {TIMES.map(t => (
                    <button
                      key={t}
                      onClick={() => setAvailabilityTime(t)}
                      className={`px-3 py-1.5 rounded-lg text-sm border-2 ${availabilityTime === t ? 'bg-violet-600 border-violet-600 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-violet-500'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : router.push('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-300 rounded-xl text-sm font-medium transition-colors"
            >
              <ChevronLeft size={16} />{step === 1 ? 'Skip' : 'Back'}
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="btn-creative flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-semibold shadow-lg"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-creative flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg"
              >
                {loading ? <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' /> : <><CheckCircle size={16} /> Complete Setup</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
