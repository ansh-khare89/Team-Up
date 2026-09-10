import { GoalId } from '../types';

const GOAL_CONFIG: Record<GoalId, { label: string; emoji: string; color: string }> = {
  dsa_partner:          { label: 'DSA Partner',         emoji: '🧠', color: 'bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10 text-[#FF6B35] border-2 border-[#FF6B35]/30' },
  project_collaborator: { label: 'Project Collab',      emoji: '🚀', color: 'bg-gradient-to-r from-[#4ECDC4]/10 to-teal-50 text-[#4ECDC4] border-2 border-[#4ECDC4]/30' },
  hackathon_teammate:   { label: 'Hackathon Crew',      emoji: '⚡', color: 'bg-gradient-to-r from-[#FF8C42]/10 to-[#FF6B35]/10 text-[#FF8C42] border-2 border-[#FF8C42]/30' },
  internship_prep:      { label: 'Internship Prep',     emoji: '💼', color: 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border-2 border-teal-200' },
  mock_interview:       { label: 'Mock Interview',      emoji: '🎯', color: 'bg-gradient-to-r from-[#FF6B35]/10 to-[#FF8C42]/10 text-[#FF6B35] border-2 border-[#FF6B35]/30' },
  open_source:          { label: 'Open Source',         emoji: '🌐', color: 'bg-gradient-to-r from-[#4ECDC4]/10 to-cyan-50 text-[#4ECDC4] border-2 border-[#4ECDC4]/30' },
  learn_tech:           { label: 'Learn New Tech',      emoji: '📚', color: 'bg-gradient-to-r from-[#FF8C42]/10 to-[#FF6B35]/10 text-[#FF8C42] border-2 border-[#FF8C42]/30' },
};

interface GoalChipProps {
  goalId: GoalId;
  selected?: boolean;
  onClick?: () => void;
}

export default function GoalChip({ goalId, selected, onClick }: GoalChipProps) {
  const config = GOAL_CONFIG[goalId] || { label: goalId, emoji: '✦', color: 'bg-gradient-to-r from-[#8B8680]/10 to-stone-50 text-[#8B8680] border-2 border-[#8B8680]/30' };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 text-xs font-semibold transition-all ${config.color} ${onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} ${selected ? 'ring-2 ring-[#FF6B35] shadow-sm' : ''}`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </button>
  );
}

