'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../services/api';
import { User, MatchResult, GoalId } from '../../../../types';
import SkillBadge from '../../../../components/SkillBadge';
import GoalChip from '../../../../components/GoalChip';
import MatchScoreBar from '../../../../components/MatchScoreBar';
import { ArrowLeft, Github, Linkedin, ExternalLink, MapPin, Calendar, UserPlus, Check, MessageSquare, Flame } from 'lucide-react';

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
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  if (!student) return (
    <div className="flex flex-col items-center justify-center h-screen text-slate-400">
      <p className="text-lg">Student not found</p>
      <button onClick={() => router.back()} className="mt-3 text-indigo-400 hover:underline">Go back</button>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm">
        <ArrowLeft size={16} />Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 text-center">
            {student.profilePicture ? (
              <img src={student.profilePicture} alt={student.name}
                className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 ring-2 ring-slate-700" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                {student.name[0]}
              </div>
            )}
            <h1 className="text-xl font-bold text-white mb-1">{student.name}</h1>
            <div className="flex items-center justify-center gap-1 text-slate-400 text-sm mb-1">
              <MapPin size={13} />{student.college}
            </div>
            <p className="text-slate-500 text-sm mb-3">{student.branch} · {student.yearOfStudy || student.year}</p>
            <span className={`inline-block text-xs px-3 py-1 rounded-full border ${
              student.activityStatus === 'Actively Looking' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' :
              student.activityStatus === 'Open to Opportunities' ? 'bg-blue-500/15 text-blue-400 border-blue-500/25' :
              'bg-slate-700 text-slate-400 border-slate-600'
            }`}>{student.activityStatus}</span>

            {/* Action buttons */}
            <div className="mt-4 space-y-2">
              <button onClick={handleConnect} disabled={connecting || connected}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  connected ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                  'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                }`}>
                {connecting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
                 connected ? <><Check size={15} />Request Sent</> : <><UserPlus size={15} />Connect</>}
              </button>
            </div>

            {/* Social links */}
            {(student.github || student.linkedin || student.portfolio || student.leetcode) && (
              <div className="mt-4 flex justify-center gap-2">
                {student.github && <a href={student.github} target="_blank" rel="noreferrer"
                  className="p-2 bg-slate-700/60 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"><Github size={16} /></a>}
                {student.linkedin && <a href={student.linkedin} target="_blank" rel="noreferrer"
                  className="p-2 bg-slate-700/60 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"><Linkedin size={16} /></a>}
                {student.portfolio && <a href={student.portfolio} target="_blank" rel="noreferrer"
                  className="p-2 bg-slate-700/60 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"><ExternalLink size={16} /></a>}
                {student.leetcode && <a href={student.leetcode} target="_blank" rel="noreferrer"
                  className="p-2 bg-slate-700/60 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors text-xs font-bold">LC</a>}
              </div>
            )}
          </div>

          {/* DSA Profile */}
          {student.dsaProfile && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Flame size={15} className="text-orange-400" />DSA Profile
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Platform</span><span className="text-white">{student.dsaProfile.platform}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Level</span><span className="text-white">{student.dsaProfile.experienceLevel}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Language</span><span className="text-white">{student.dsaProfile.preferredLanguage}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Daily goal</span><span className="text-white">{student.dsaProfile.dailyGoal} problems</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Streak</span><span className="text-orange-400 font-semibold">{student.dsaProfile.streakCount} 🔥</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Bio */}
          {student.bio && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-2">About</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{student.bio}</p>
            </div>
          )}

          {/* Match score */}
          {match && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-3">Compatibility with you</h2>
              <MatchScoreBar percentage={match.compatibilityPercentage} breakdown={match.breakdown} />
              {match.whyThisMatch?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {match.whyThisMatch.map((r, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg">{r}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Skills */}
          {student.skills?.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((s, i) => <SkillBadge key={i} skill={s} />)}
              </div>
            </div>
          )}

          {/* Goals */}
          {student.currentGoals?.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-3">Looking for</h2>
              <div className="flex flex-wrap gap-2">
                {(student.currentGoals as GoalId[]).map(g => <GoalChip key={g} goalId={g} />)}
              </div>
            </div>
          )}

          {/* Availability */}
          {student.availabilityDays?.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Calendar size={14} />Availability</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {student.availabilityDays.map(d => (
                  <span key={d} className="px-3 py-1 bg-slate-700/60 border border-slate-600 text-slate-300 text-xs rounded-lg">{d}</span>
                ))}
              </div>
              {student.availabilityTime && (
                <p className="text-slate-400 text-xs">⏰ {student.availabilityTime}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
