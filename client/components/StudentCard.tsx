'use client';

import Link from 'next/link';
import { User, MatchResult, GoalId } from '../types';
import { api } from '../services/api';
import { useState } from 'react';
import SkillBadge from './SkillBadge';
import GoalChip from './GoalChip';
import MatchScoreBar from './MatchScoreBar';
import { UserPlus, Check, ExternalLink, Sparkles, GraduationCap, Flame, Zap } from 'lucide-react';

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
    badge: 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border-teal-200'
  },
  'Open to Opportunities': {
    label: 'Open to Collabs',
    dot: 'bg-[#4ECDC4]',
    badge: 'bg-gradient-to-r from-[#4ECDC4]/10 to-teal-50 text-[#4ECDC4] border-[#4ECDC4]/30'
  },
  'Not Looking Right Now': {
    label: 'Focusing on Studies',
    dot: 'bg-[#8B8680]',
    badge: 'bg-gradient-to-r from-[#8B8680]/10 to-stone-50 text-[#8B8680] border-[#8B8680]/30'
  },
};

export default function StudentCard({ student, match, showConnect = true, onConnected }: StudentCardProps) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

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
    <div className="card-human rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between group bg-white border-2 border-[#FDF2D8] shadow-sm">
      <div>
        {/* Header with Avatar, Details & Status */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative flex-shrink-0">
            {student.profilePicture && !imgError ? (
              <img
                src={student.profilePicture}
                alt={student.name}
                loading="lazy"
                decoding="async"
                width={56}
                height={56}
                onError={() => setImgError(true)}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#FDF2D8] group-hover:ring-[#FF6B35]/30 transition-all shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#4ECDC4] flex items-center justify-center text-xl font-bold text-white shadow-sm">
                {student.name[0]}
              </div>
            )}
            {/* Live activity indicator */}
            <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${status.dot}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1.5">
              <Link href={`/students/${student.id}`} className="hover:underline">
                <h3 className="font-bold text-[#2D2A26] text-base group-hover:text-[#FF6B35] transition-colors truncate">
                  {student.name}
                </h3>
              </Link>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full border-2 font-semibold whitespace-nowrap ${status.badge}`}>
                {status.label}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[#8B8680] text-xs mt-1 font-medium">
              <GraduationCap size={13} className="text-[#FF6B35] flex-shrink-0" />
              <span className="truncate">{student.college}</span>
            </div>
            
            <p className="text-[#8B8680] text-xs mt-0.5 truncate">
              {student.branch} · <span className="text-[#2D2A26] font-medium">{student.yearOfStudy || student.year}</span>
            </p>
          </div>
        </div>

        {/* Bio / Quote */}
        {student.bio && (
          <p className="text-[#2D2A26] text-xs leading-relaxed mb-3.5 line-clamp-2 bg-gradient-to-r from-[#FFF9ED] to-[#FFF4E5] p-2.5 rounded-xl border-2 border-[#FDF2D8] italic">
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
                <span className="text-[11px] text-[#8B8680] px-2 py-0.5 bg-gradient-to-r from-[#FFF9ED] to-[#FFF4E5] rounded-md border-2 border-[#FDF2D8] font-medium">
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
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 border-2 border-[#FF6B35]/30 text-[#FF6B35] text-xs font-semibold">
              <Flame size={12} className="text-[#FF6B35] fill-[#FF6B35]" />
              {streak}d streak
            </span>
          )}
        </div>

        {/* Match score bar if available */}
        {match && (
          <div className="mb-4 bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5 p-2.5 rounded-xl border-2 border-[#FDF2D8]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#FF6B35] flex items-center gap-1">
                <Sparkles size={12} className="text-[#FF6B35]" />
                Compatibility Score
              </span>
              <span className="text-xs font-bold text-[#FF6B35]">{match.compatibilityPercentage}%</span>
            </div>
            <MatchScoreBar percentage={match.compatibilityPercentage} compact />
          </div>
        )}
      </div>

      {/* Action Footer */}
      {showConnect && (
        <div className="flex items-center gap-2 pt-3 border-t-2 border-[#FDF2D8] mt-auto">
          <button
            onClick={handleConnect}
            disabled={loading || connected}
            className={`btn-creative flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold transition-all shadow-sm ${
              connected
                ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border-2 border-teal-200 !text-teal-700 !shadow-none'
                : ''
            }`}
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : connected ? (
              <><Check size={14} className="text-teal-600" /> Request Sent</>
            ) : (
              <><UserPlus size={14} /> Connect</>
            )}
          </button>
          
          <Link
            href={`/students/${student.id}`}
            className="p-2 bg-gradient-to-r from-[#FFF9ED] to-[#FFF4E5] hover:from-[#FFE9CC] hover:to-[#FFDEB3] text-[#8B8680] hover:text-[#2D2A26] rounded-xl border-2 border-[#FDF2D8] transition-colors"
            title="View Full Profile"
          >
            <ExternalLink size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}


