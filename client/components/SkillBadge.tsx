import { Skill } from '../types';

const LEVEL_STYLES: Record<string, string> = {
  Advanced: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200/80',
  Intermediate: 'bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border-sky-200/80',
  Beginner: 'bg-gradient-to-r from-stone-50 to-gray-50 text-stone-700 border-stone-200',
};

const CATEGORY_DOT: Record<string, string> = {
  'Programming Languages': 'bg-gradient-to-r from-violet-500 to-purple-500',
  'Web Development': 'bg-gradient-to-r from-sky-500 to-blue-500',
  'AI / Machine Learning': 'bg-gradient-to-r from-amber-500 to-orange-500',
  'Mobile Development': 'bg-gradient-to-r from-emerald-500 to-green-500',
  'DevOps / Cloud': 'bg-gradient-to-r from-cyan-500 to-sky-500',
  'Problem Solving': 'bg-gradient-to-r from-rose-500 to-pink-500',
  'Other Technical Skills': 'bg-gradient-to-r from-stone-400 to-gray-400',
};

interface SkillBadgeProps {
  skill: Skill;
  showLevel?: boolean;
}

export default function SkillBadge({ skill, showLevel = true }: SkillBadgeProps) {
  const style = LEVEL_STYLES[skill.level] || LEVEL_STYLES['Beginner'];
  const dot = CATEGORY_DOT[skill.category] || 'bg-gradient-to-r from-stone-400 to-gray-400';

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

