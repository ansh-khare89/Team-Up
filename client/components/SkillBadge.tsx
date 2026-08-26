import { Skill } from '../types';

const LEVEL_STYLES: Record<string, string> = {
  Advanced: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  Intermediate: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  Beginner: 'bg-slate-100 text-slate-700 border-slate-200',
};

const CATEGORY_DOT: Record<string, string> = {
  'Programming Languages': 'bg-violet-500',
  'Web Development': 'bg-indigo-500',
  'AI / Machine Learning': 'bg-amber-500',
  'Mobile Development': 'bg-emerald-500',
  'DevOps / Cloud': 'bg-sky-500',
  'Problem Solving': 'bg-rose-500',
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
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
      <span>{skill.name}</span>
      {showLevel && (
        <span className="opacity-60 text-[10px] font-normal">· {skill.level}</span>
      )}
    </span>
  );
}

