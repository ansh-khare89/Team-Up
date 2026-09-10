import { Skill } from '../types';

const LEVEL_STYLES: Record<string, string> = {
  Advanced: 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border-2 border-teal-200',
  Intermediate: 'bg-gradient-to-r from-[#4ECDC4]/10 to-teal-50 text-[#4ECDC4] border-2 border-[#4ECDC4]/30',
  Beginner: 'bg-gradient-to-r from-[#8B8680]/10 to-stone-50 text-[#8B8680] border-2 border-[#8B8680]/30',
};

const CATEGORY_DOT: Record<string, string> = {
  'Programming Languages': 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]',
  'Web Development': 'bg-gradient-to-r from-[#4ECDC4] to-teal-500',
  'AI / Machine Learning': 'bg-gradient-to-r from-[#FF8C42] to-[#FF6B35]',
  'Mobile Development': 'bg-gradient-to-r from-teal-400 to-emerald-500',
  'DevOps / Cloud': 'bg-gradient-to-r from-[#4ECDC4] to-cyan-500',
  'Problem Solving': 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42]',
  'Other Technical Skills': 'bg-gradient-to-r from-[#8B8680] to-stone-400',
};

interface SkillBadgeProps {
  skill: Skill;
  showLevel?: boolean;
}

export default function SkillBadge({ skill, showLevel = true }: SkillBadgeProps) {
  const style = LEVEL_STYLES[skill.level] || LEVEL_STYLES['Beginner'];
  const dot = CATEGORY_DOT[skill.category] || 'bg-gradient-to-r from-[#8B8680] to-stone-400';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border-2 ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
      <span>{skill.name}</span>
      {showLevel && (
        <span className="opacity-60 text-[10px] font-normal">· {skill.level}</span>
      )}
    </span>
  );
}

