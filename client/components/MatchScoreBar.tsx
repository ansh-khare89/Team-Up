interface MatchScoreBarProps {
  percentage: number;
  breakdown?: Record<string, number>;
  compact?: boolean;
}

const SCORE_COLOR = (pct: number) => {
  if (pct >= 80) return 'from-emerald-500 to-teal-500 text-emerald-700';
  if (pct >= 60) return 'from-indigo-500 to-blue-500 text-indigo-700';
  if (pct >= 40) return 'from-amber-500 to-orange-500 text-amber-700';
  return 'from-slate-400 to-slate-500 text-slate-600';
};

const LABEL_COLORS: Record<string, string> = {
  goalMatchScore: 'bg-violet-500',
  complementarySkillsScore: 'bg-indigo-500',
  commonSkillsScore: 'bg-emerald-500',
  experienceScore: 'bg-amber-500',
  availabilityScore: 'bg-teal-500',
  activityScore: 'bg-rose-500',
};

const LABEL_NAMES: Record<string, string> = {
  goalMatchScore: 'Goals',
  complementarySkillsScore: 'Complementary Skills',
  commonSkillsScore: 'Common Skills',
  experienceScore: 'Experience',
  availabilityScore: 'Availability',
  activityScore: 'Activity',
};

export default function MatchScoreBar({ percentage, breakdown, compact = false }: MatchScoreBarProps) {
  const color = SCORE_COLOR(percentage);
  const pct = Math.min(100, Math.max(0, percentage));

  return (
    <div className="space-y-2">
      {/* Main score */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className={`h-full bg-gradient-to-r ${color.split(' ')[0]} ${color.split(' ')[1]} rounded-full transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-bold ${color.split(' ')[2]} flex-shrink-0`}>
          {pct}%
        </span>
      </div>

      {/* Breakdown bars */}
      {!compact && breakdown && Object.keys(breakdown).length > 0 && (
        <div className="space-y-1.5 pt-1">
          {Object.entries(breakdown).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 w-28 truncate">{LABEL_NAMES[key] || key}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div
                  className={`h-full ${LABEL_COLORS[key] || 'bg-slate-400'} rounded-full`}
                  style={{ width: `${Math.min(100, val)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-600 w-8 text-right">{Math.round(val)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

