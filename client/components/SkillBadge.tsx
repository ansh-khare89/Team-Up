import { Skill } from '../types';

const LEVEL_STYLES: Record<string, string> = {
  Advanced: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  Intermediate: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  Beginner: 'bg-zinc-500/10 text-zinc-400 border border-zinc-600/20',
};

const CATEGORY_DOT: Record<string, string> = {
  'Programming Languages': 'bg-violet-400',
  'Web Development': 'bg-sky-400',
  'AI / Machine Learning': 'bg-pink-400',
  'Mobile Development': 'bg-emerald-400',
  'DevOps / Cloud': 'bg-orange-400',
  'Problem Solving': 'bg-amber-400',
  'Other Technical Skills': 'bg-zinc-400',
};

interface SkillBadgeProps {
  skill: Skill;
  showLevel?: boolean;
}

export default function SkillBadge({ skill, showLevel = true }: SkillBadgeProps) {
  const style = LEVEL_STYLES[skill.level] || LEVEL_STYLES['Beginner'];
  const dot = CATEGORY_DOT[skill.category] || 'bg-zinc-400';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
      <span>{skill.name}</span>
      {showLevel && (
        <span className="opacity-60 text-[10px] font-normal">· {skill.level}</span>
      )}
    </span>
  );
}
