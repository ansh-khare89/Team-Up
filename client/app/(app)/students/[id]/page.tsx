'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../services/api';
import { User, MatchResult, GoalId } from '../../../../types';
import SkillBadge from '../../../../components/SkillBadge';
import GoalChip from '../../../../components/GoalChip';
import MatchScoreBar from '../../../../components/MatchScoreBar';
import { ArrowLeft, Github, Linkedin, ExternalLink, MapPin, Calendar, UserPlus, Check, Flame, Code2, GraduationCap } from 'lucide-react';

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [student, setStudent] = useState<User | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    api.getStudentProfile(id).then(res => {
      setStudent(res.student);
      setMatch(res.match);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await api.sendConnectionRequest(id);
      setConnected(true);
    } catch {} finally { setConnecting(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (!student) return (
    <div className="flex flex-col items-center justify-center h-screen text-slate-500">
      <p className="text-lg font-bold text-slate-900">Student not found</p>
      <button onClick={() => router.back()} className="mt-3 text-indigo-600 font-semibold hover:underline">Go back</button>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold">
        <ArrowLeft size={16} />Back to directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card-human bg-white border border-slate-200/90 rounded-3xl p-6 text-center shadow-sm">
            {student.profilePicture ? (
              <img src={student.profilePicture} alt={student.name}
                className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 ring-2 ring-slate-100 shadow-sm" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4 shadow-sm">
                {student.name[0]}
              </div>
            )}
            <h1 className="text-xl font-bold text-slate-900 mb-1">{student.name}</h1>
            <div className="flex items-center justify-center gap-1.5 text-slate-600 text-xs font-medium mb-1">
              <GraduationCap size={14} className="text-indigo-600" />{student.college}
            </div>
            <p className="text-slate-500 text-xs mb-3">{student.branch} · {student.yearOfStudy || student.year}</p>
            <span className={`inline-block text-xs px-3 py-1 rounded-full border font-semibold ${
              student.activityStatus === 'Actively Looking' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              student.activityStatus === 'Open to Opportunities' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-slate-100 text-slate-600 border-slate-200'
            }`}>{student.activityStatus}</span>

            {/* Action buttons */}
            <div className="mt-5 space-y-2">
              <button onClick={handleConnect} disabled={connecting || connected}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  connected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                }`}>
                {connecting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                 connected ? <><Check size={15} className="text-emerald-600" />Request Sent</> : <><UserPlus size={15} />Connect</>}
              </button>
            </div>

            {/* Social links */}
            {(student.github || student.linkedin || student.portfolio || student.leetcode) && (
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-center gap-2">
                {student.github && <a href={student.github} target="_blank" rel="noreferrer"
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 transition-colors"><Github size={16} /></a>}
                {student.linkedin && <a href={student.linkedin} target="_blank" rel="noreferrer"
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 transition-colors"><Linkedin size={16} /></a>}
                {student.portfolio && <a href={student.portfolio} target="_blank" rel="noreferrer"
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 transition-colors"><ExternalLink size={16} /></a>}
                {student.leetcode && <a href={student.leetcode} target="_blank" rel="noreferrer"
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 transition-colors text-xs font-bold">LC</a>}
              </div>
            )}
          </div>

          {/* DSA Profile */}
          {student.dsaProfile && (
            <div className="card-human bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Flame size={15} className="text-orange-500 fill-orange-500" />DSA Overview
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Platform</span><span className="text-slate-900 font-bold">{student.dsaProfile.platform}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Skill Level</span><span className="text-slate-900 font-bold">{student.dsaProfile.experienceLevel}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Language</span><span className="text-slate-900 font-bold">{student.dsaProfile.preferredLanguage}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Daily Target</span><span className="text-slate-900 font-bold">{student.dsaProfile.dailyGoal} problems</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Streak</span><span className="text-orange-600 font-bold">{student.dsaProfile.streakCount} days 🔥</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Bio */}
          {student.bio && (
            <div className="card-human bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">About</h2>
              <p className="text-slate-700 text-sm leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">"{student.bio}"</p>
            </div>
          )}

          {/* Match score */}
          {match && (
            <div className="card-human bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Compatibility Breakdown</h2>
              <MatchScoreBar percentage={match.compatibilityPercentage} breakdown={match.breakdown} />
              {match.whyThisMatch?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {match.whyThisMatch.map((r, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium rounded-lg">{r}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Skills */}
          {student.skills?.length > 0 && (
            <div className="card-human bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Skills & Proficiencies</h2>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((s, i) => <SkillBadge key={i} skill={s} />)}
              </div>
            </div>
          )}

          {/* Goals */}
          {student.currentGoals?.length > 0 && (
            <div className="card-human bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Looking For</h2>
              <div className="flex flex-wrap gap-2">
                {(student.currentGoals as GoalId[]).map(g => <GoalChip key={g} goalId={g} />)}
              </div>
            </div>
          )}

          {/* Availability */}
          {student.availabilityDays?.length > 0 && (
            <div className="card-human bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2"><Calendar size={14} className="text-indigo-600" />Availability</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {student.availabilityDays.map(d => (
                  <span key={d} className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg">{d}</span>
                ))}
              </div>
              {student.availabilityTime && (
                <p className="text-slate-500 text-xs font-medium">⏰ {student.availabilityTime}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

