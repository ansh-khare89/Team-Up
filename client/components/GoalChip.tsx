import { GoalId } from '../types';

const GOAL_CONFIG: Record<GoalId, { label: string; emoji: string; color: string }> = {
  dsa_partner:          { label: 'DSA Partner',         emoji: '🧠', color: 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border-violet-200' },
  project_collaborator: { label: 'Project Collab',      emoji: '🚀', color: 'bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border-sky-200' },
  hackathon_teammate:   { label: 'Hackathon Crew',      emoji: '⚡', color: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200' },
  internship_prep:      { label: 'Internship Prep',     emoji: '💼', color: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200' },
  mock_interview:       { label: 'Mock Interview',      emoji: '🎯', color: 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-200' },
  open_source:          { label: 'Open Source',         emoji: '🌐', color: 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-teal-200' },
  learn_tech:           { label: 'Learn New Tech',      emoji: '📚', color: 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200' },
};

interface GoalChipProps {
  goalId: GoalId;
  selected?: boolean;
  onClick?: () => void;
}

export default function GoalChip({ goalId, selected, onClick }: GoalChipProps) {
  const config = GOAL_CONFIG[goalId] || { label: goalId, emoji: '✦', color: 'bg-gradient-to-r from-stone-50 to-gray-50 text-stone-700 border-stone-200' };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold transition-all ${config.color} ${onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} ${selected ? 'ring-2 ring-orange-500 shadow-sm' : ''}`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </button>
  );
}

