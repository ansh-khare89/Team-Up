'use client';

import Link from 'next/link';
import { User, MatchResult, GoalId } from '../types';
import { api } from '../services/api';
import { useState } from 'react';
import SkillBadge from './SkillBadge';
import GoalChip from './GoalChip';
import MatchScoreBar from './MatchScoreBar';
import { UserPlus, Check, ExternalLink, Sparkles, GraduationCap, Flame } from 'lucide-react';

interface StudentCardProps {
  student: User;
  match?: MatchResult;
  showConnect?: boolean;
  onConnected?: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  'Actively Looking': {
    label: 'Actively Looking',
    dot: 'bg-emerald-500 animate-pulse-live',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  'Open to Opportunities': {
    label: 'Open to Collabs',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  'Not Looking Right Now': {
    label: 'Focusing on Studies',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 border-slate-200'
  },
};

export default function StudentCard({ student, match, showConnect = true, onConnected }: StudentCardProps) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading || connected) return;
    setLoading(true);
    try {
      await api.sendConnectionRequest(student.id);
      setConnected(true);
      onConnected?.();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const displaySkills = student.skills?.slice(0, 4) || [];
  const displayGoals = (student.currentGoals || []).slice(0, 2) as GoalId[];
  const status = STATUS_CONFIG[student.activityStatus] || STATUS_CONFIG['Not Looking Right Now'];
  const streak = student.dsaProfile?.streakCount || 0;

  return (
    <div className="card-human rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300">
      <div>
        {/* Header with Avatar, Details & Status */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative flex-shrink-0">
            {student.profilePicture ? (
              <img
                src={student.profilePicture}
                alt={student.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-sm">
                {student.name[0]}
              </div>
            )}
            {/* Live activity indicator */}
            <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${status.dot}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5">
              <Link href={`/students/${student.id}`} className="hover:underline">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors truncate">
                  {student.name}
                </h3>
              </Link>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold whitespace-nowrap ${status.badge}`}>
                {status.label}
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-500 text-xs mt-1 font-medium">
              <GraduationCap size={13} className="text-indigo-600 flex-shrink-0" />
              <span className="truncate">{student.college}</span>
            </div>
            
            <p className="text-slate-500 text-xs mt-0.5 truncate">
              {student.branch} · <span className="text-slate-700 font-medium">{student.yearOfStudy || student.year}</span>
            </p>
          </div>
        </div>

        {/* Bio / Quote */}
        {student.bio && (
          <p className="text-slate-600 text-xs leading-relaxed mb-3.5 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
            "{student.bio}"
          </p>
        )}

        {/* Skills */}
        {displaySkills.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {displaySkills.map((s, i) => (
                <SkillBadge key={i} skill={s} showLevel={false} />
              ))}
              {(student.skills?.length || 0) > 4 && (
                <span className="text-[11px] text-slate-500 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200 font-medium">
                  +{student.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Goals & Streak */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          {displayGoals.map(g => (
            <GoalChip key={g} goalId={g} />
          ))}
          {streak > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
              <Flame size={12} className="text-orange-500 fill-orange-500" />
              {streak}d streak
            </span>
          )}
        </div>

        {/* Match score bar if available */}
        {match && (
          <div className="mb-4 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1">
                <Sparkles size={12} className="text-indigo-600" />
                Compatibility Score
              </span>
              <span className="text-xs font-bold text-indigo-700">{match.compatibilityPercentage}%</span>
            </div>
            <MatchScoreBar percentage={match.compatibilityPercentage} compact />
          </div>
        )}
      </div>

      {/* Action Footer */}
      {showConnect && (
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-auto">
          <button
            onClick={handleConnect}
            disabled={loading || connected}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              connected
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : connected ? (
              <><Check size={14} className="text-emerald-600" /> Request Sent</>
            ) : (
              <><UserPlus size={14} /> Connect</>
            )}
          </button>
          
          <Link
            href={`/students/${student.id}`}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 transition-colors"
            title="View Full Profile"
          >
            <ExternalLink size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}


