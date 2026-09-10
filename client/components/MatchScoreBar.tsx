interface MatchScoreBarProps {
  percentage: number;
  breakdown?: Record<string, number>;
  compact?: boolean;
}

const SCORE_COLOR = (pct: number) => {
  if (pct >= 80) return 'from-teal-400 to-emerald-500 text-teal-700';
  if (pct >= 60) return 'from-[#4ECDC4] to-teal-500 text-[#4ECDC4]';
  if (pct >= 40) return 'from-[#FF8C42] to-[#FF6B35] text-[#FF8C42]';
  return 'from-[#8B8680] to-stone-500 text-[#8B8680]';
};

const LABEL_COLORS: Record<string, string> = {
  goalMatchScore: 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]',
  complementarySkillsScore: 'bg-gradient-to-r from-[#4ECDC4] to-teal-500',
  commonSkillsScore: 'bg-gradient-to-r from-teal-400 to-emerald-500',
  experienceScore: 'bg-gradient-to-r from-[#FF8C42] to-[#FF6B35]',
  availabilityScore: 'bg-gradient-to-r from-[#4ECDC4] to-cyan-500',
  activityScore: 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]',
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
        <div className="flex-1 h-2 bg-gradient-to-r from-[#FFF9ED] to-[#FFF4E5] rounded-full overflow-hidden border-2 border-[#FDF2D8]">
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
              <span className="text-xs text-[#8B8680] w-28 truncate">{LABEL_NAMES[key] || key}</span>
              <div className="flex-1 h-1.5 bg-gradient-to-r from-[#FFF9ED] to-[#FFF4E5] rounded-full overflow-hidden border-2 border-[#FDF2D8]">
                <div
                  className={`h-full ${LABEL_COLORS[key] || 'bg-gradient-to-r from-[#8B8680] to-stone-400'} rounded-full`}
                  style={{ width: `${Math.min(100, val)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-[#2D2A26] w-8 text-right">{Math.round(val)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

