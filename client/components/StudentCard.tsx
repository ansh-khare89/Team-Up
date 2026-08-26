'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, MatchResult, GoalId } from '../types';
import { api } from '../services/api';
import { useState } from 'react';
import SkillBadge from './SkillBadge';
import GoalChip from './GoalChip';
import MatchScoreBar from './MatchScoreBar';
import { MapPin, UserPlus, MessageSquare, Check, ExternalLink } from 'lucide-react';

interface StudentCardProps {
  student: User;
  match?: MatchResult;
  showConnect?: boolean;
  onConnected?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  'Actively Looking':         'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Open to Opportunities':    'bg-blue-500/15    text-blue-400    border-blue-500/25',
  'Not Looking Right Now':    'bg-slate-700      text-slate-400   border-slate-600',
};

export default function StudentCard({ student, match, showConnect = true, onConnected }: StudentCardProps) {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
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

  const displaySkills = student.skills?.slice(0, 3) || [];
  const displayGoals = (student.currentGoals || []).slice(0, 2) as GoalId[];
  const statusStyle = STATUS_STYLES[student.activityStatus] || STATUS_STYLES['Not Looking Right Now'];

  return (
    <Link href={`/students/${student.id}`} className="block group">
      <div className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative flex-shrink-0">
            {student.profilePicture ? (
              <img
                src={student.profilePicture}
                alt={student.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-indigo-500/30 transition-all"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-bold text-white ring-2 ring-slate-700">
                {student.name[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors">{student.name}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                  <MapPin size={11} />
                  <span className="truncate">{student.college}</span>
                </div>
                <p className="text-slate-500 text-xs mt-0.5">{student.branch} · {student.yearOfStudy || student.year}</p>
              </div>
              <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border ${statusStyle}`}>
                {student.activityStatus === 'Actively Looking' ? '🟢 Active' :
                 student.activityStatus === 'Open to Opportunities' ? '🔵 Open' : '⚫ Busy'}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {student.bio && (
          <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">{student.bio}</p>
        )}

        {/* Skills */}
        {displaySkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {displaySkills.map((s, i) => (
              <SkillBadge key={i} skill={s} showLevel={false} />
            ))}
            {(student.skills?.length || 0) > 3 && (
              <span className="text-xs text-slate-500 px-2 py-1 bg-slate-700/40 rounded-lg">+{student.skills.length - 3}</span>
            )}
          </div>
        )}

        {/* Goals */}
        {displayGoals.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {displayGoals.map(g => <GoalChip key={g} goalId={g} />)}
          </div>
        )}

        {/* Match score */}
        {match && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Compatibility</span>
            </div>
            <MatchScoreBar percentage={match.compatibilityPercentage} compact />
          </div>
        )}

        {/* Actions */}
        {showConnect && (
          <div className="flex gap-2 pt-1" onClick={e => e.preventDefault()}>
            <button
              onClick={handleConnect}
              disabled={loading || connected}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all ${
                connected
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/25'
              }`}
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
              ) : connected ? (
                <><Check size={13} />Requested</>
              ) : (
                <><UserPlus size={13} />Connect</>
              )}
            </button>
            <Link href={`/students/${student.id}`}
              className="px-3 py-2 bg-slate-700/60 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors">
              <ExternalLink size={14} />
            </Link>
          </div>
        )}
      </div>
    </Link>
  );
}
