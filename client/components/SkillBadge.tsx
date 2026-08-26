import { Skill } from '../types';

const LEVEL_STYLES: Record<string, string> = {
  Advanced: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  Intermediate: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  Beginner: 'bg-slate-700/60 text-slate-400 border border-slate-600',
};

const CATEGORY_DOT: Record<string, string> = {
  'Programming Languages': 'bg-violet-400',
  'Web Development': 'bg-blue-400',
  'AI / Machine Learning': 'bg-amber-400',
  'Mobile Development': 'bg-emerald-400',
  'DevOps / Cloud': 'bg-orange-400',
  'Problem Solving': 'bg-red-400',
  'Other Technical Skills': 'bg-slate-400',
};

interface SkillBadgeProps {
  skill: Skill;
  showLevel?: boolean;
}

export default function SkillBadge({ skill, showLevel = true }: SkillBadgeProps) {
  const style = LEVEL_STYLES[skill.level] || LEVEL_STYLES['Beginner'];
  const dot = CATEGORY_DOT[skill.category] || 'bg-slate-400';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
      {skill.name}
      {showLevel && (
        <span className="opacity-60">· {skill.level}</span>
      )}
    </span>
  );
}
