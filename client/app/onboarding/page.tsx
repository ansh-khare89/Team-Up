'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { GoalId } from '../../types';
import { CheckCircle, ChevronRight, ChevronLeft, GraduationCap, Code2, Target, Plus, X } from 'lucide-react';

const GOAL_OPTIONS: { id: GoalId; label: string; emoji: string; desc: string }[] = [
  { id: 'dsa_partner', label: 'DSA Partner', emoji: '🧠', desc: 'Daily problem solving buddy' },
  { id: 'project_collaborator', label: 'Project Collaborator', emoji: '🚀', desc: 'Build side projects together' },
  { id: 'hackathon_teammate', label: 'Hackathon Teammate', emoji: '⚡', desc: 'Win hackathons as a team' },
  { id: 'internship_prep', label: 'Internship Prep', emoji: '💼', desc: 'Crack placements together' },
  { id: 'mock_interview', label: 'Mock Interviews', emoji: '🎯', desc: 'Practice technical interviews' },
  { id: 'open_source', label: 'Open Source', emoji: '🌐', desc: 'Contribute to OSS projects' },
  { id: 'learn_tech', label: 'Learn New Tech', emoji: '📚', desc: 'Study a new technology' },
];

const SKILL_CATEGORIES = ['Programming Languages', 'Web Development', 'AI / Machine Learning', 'Mobile Development', 'DevOps / Cloud', 'Problem Solving', 'Other Technical Skills'];

const COMMON_SKILLS = ['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'Go', 'React', 'Next.js', 'Node.js', 'Vue.js', 'Machine Learning', 'Deep Learning', 'Data Science', 'Flutter', 'React Native', 'Docker', 'Kubernetes', 'AWS', 'DSA', 'Competitive Programming', 'UI/UX', 'Spring Boot', 'FastAPI', 'GraphQL', 'PostgreSQL', 'MongoDB'];

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

  const removeSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index));

  const toggleGoal = (g: GoalId) => {
    setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const toggleDay = (d: string) => {
    setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

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

  const levelColor = (level: string) => {
    if (level === 'Advanced') return 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 border-emerald-200';
    if (level === 'Intermediate') return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-blue-200';
    return 'bg-[#FFF9ED] text-[#8B8680] border-[#FDF2D8]';
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-[#FF6B35]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#8B8680] text-sm mb-1">Step {step} of 3</p>
          <h1 className="text-3xl font-bold text-[#2D2A26]">
            {step === 1 && '🎓 Tell us about yourself'}
            {step === 2 && '💡 What are your skills?'}
            {step === 3 && '🎯 What are you looking for?'}
          </h1>
          {/* Progress bar */}
          <div className="mt-4 flex gap-2 justify-center">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s <= step ? 'bg-[#FF6B35] w-16' : 'bg-[#FDF2D8] w-8'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border-2 border-[#FDF2D8] rounded-2xl p-8 shadow-xl">
          {/* Step 1: College Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#8B8680] mb-1.5">College / University</label>
                  <input
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    placeholder="e.g. IIT Bombay"
                    className="w-full px-4 py-3 bg-[#FFF9ED] border-2 border-[#FDF2D8] rounded-xl text-[#2D2A26] placeholder-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8B8680] mb-1.5">Branch / Major</label>
                  <input
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-3 bg-[#FFF9ED] border-2 border-[#FDF2D8] rounded-xl text-[#2D2A26] placeholder-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B8680] mb-1.5">Year of Study</label>
                <div className="flex flex-wrap gap-2">
                  {YEARS.map(y => (
                    <button key={y} onClick={() => setYear(y)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${year === y ? 'bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] border-[#FF6B35] text-white' : 'bg-[#FFF9ED] border-[#FDF2D8] text-[#2D2A26] hover:border-[#FF6B35]/50'}`}>
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B8680] mb-1.5">Activity Status</label>
                <div className="flex flex-wrap gap-2">
                  {['Actively Looking', 'Open to Opportunities', 'Not Looking Right Now'].map(s => (
                    <button key={s} onClick={() => setActivityStatus(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${activityStatus === s ? 'bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] border-[#FF6B35] text-white' : 'bg-[#FFF9ED] border-[#FDF2D8] text-[#2D2A26] hover:border-[#FF6B35]/50'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8B8680] mb-1.5">Bio <span className="text-[#8B8680] font-normal">(optional)</span></label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell other students about yourself, what you're building, and what you're passionate about..."
                  className="w-full px-4 py-3 bg-[#FFF9ED] border-2 border-[#FDF2D8] rounded-xl text-[#2D2A26] placeholder-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Skill input */}
              <div>
                <label className="block text-sm font-medium text-[#8B8680] mb-2">Add a skill</label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill(skillInput)}
                    placeholder="e.g. React, Python, DSA..."
                    className="flex-1 px-4 py-2.5 bg-[#FFF9ED] border-2 border-[#FDF2D8] rounded-xl text-[#2D2A26] placeholder-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-sm"
                  />
                  <select
                    value={skillLevel}
                    onChange={e => setSkillLevel(e.target.value)}
                    className="px-3 py-2.5 bg-[#FFF9ED] border-2 border-[#FDF2D8] rounded-xl text-[#2D2A26] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <button onClick={() => addSkill(skillInput)}
                    className="px-3 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF8C42] hover:to-[#4ECDC4] text-white rounded-xl transition-colors">
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Category selector */}
              <div className="flex flex-wrap gap-1.5">
                {SKILL_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setSkillCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border-2 transition-all ${skillCategory === cat ? 'bg-gradient-to-r from-[#FF6B35]/20 to-[#4ECDC4]/20 border-[#FF6B35]/50 text-[#FF6B35]' : 'bg-[#FFF9ED] border-[#FDF2D8] text-[#8B8680] hover:text-[#2D2A26]'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Common skill quick-add */}
              <div>
                <p className="text-xs text-[#8B8680] mb-2">Quick add popular skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_SKILLS.filter(s => !skills.find(sk => sk.name === s)).slice(0, 14).map(s => (
                    <button key={s} onClick={() => addSkill(s)}
                      className="px-2.5 py-1 bg-[#FFF9ED] hover:bg-[#FFE9CC] border-2 border-[#FDF2D8] hover:border-[#FF6B35]/50 rounded-lg text-xs text-[#2D2A26] hover:text-[#FF6B35] transition-all">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Added skills */}
              {skills.length > 0 && (
                <div>
                  <p className="text-xs text-[#8B8680] mb-2">Your skills ({skills.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-medium ${levelColor(s.level)}`}>
                        {s.name}
                        <span className="opacity-60">· {s.level}</span>
                        <button onClick={() => removeSkill(i)} className="ml-1 opacity-60 hover:opacity-100">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Goals & Availability */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#8B8680] mb-3">What are you looking for? <span className="text-[#8B8680]">(select all that apply)</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GOAL_OPTIONS.map(g => (
                    <button key={g.id} onClick={() => toggleGoal(g.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${selectedGoals.includes(g.id) ? 'bg-gradient-to-r from-[#FF6B35]/15 to-[#4ECDC4]/15 border-[#FF6B35]/50 text-[#2D2A26]' : 'bg-[#FFF9ED] border-[#FDF2D8] text-[#2D2A26] hover:border-[#FF6B35]/50'}`}>
                      <span className="text-xl">{g.emoji}</span>
                      <div>
                        <p className="text-sm font-medium">{g.label}</p>
                        <p className="text-xs text-[#8B8680]">{g.desc}</p>
                      </div>
                      {selectedGoals.includes(g.id) && <CheckCircle size={16} className="ml-auto mt-0.5 text-[#FF6B35] flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8B8680] mb-2">Availability days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(d => (
                    <button key={d} onClick={() => toggleDay(d)}
                      className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-all ${selectedDays.includes(d) ? 'bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] border-[#FF6B35] text-white' : 'bg-[#FFF9ED] border-[#FDF2D8] text-[#2D2A26] hover:border-[#FF6B35]/40'}`}>
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8B8680] mb-2">Preferred time</label>
                <div className="flex flex-wrap gap-2">
                  {TIMES.map(t => (
                    <button key={t} onClick={() => setAvailabilityTime(t)}
                      className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-all ${availabilityTime === t ? 'bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] border-[#FF6B35] text-white' : 'bg-[#FFF9ED] border-[#FDF2D8] text-[#2D2A26] hover:border-[#FF6B35]/40'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : router.push('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FFF9ED] hover:bg-[#FFE9CC] border-2 border-[#FDF2D8] text-[#8B8680] hover:text-[#2D2A26] rounded-xl text-sm font-medium transition-colors"
            >
              <ChevronLeft size={16} />{step === 1 ? 'Skip' : 'Back'}
            </button>

            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="btn-creative flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#FF6B35]/25">
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="btn-creative flex items-center gap-2 px-6 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-50 shadow-lg shadow-[#FF6B35]/25">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle size={16} />Complete Setup</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
