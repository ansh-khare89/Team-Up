import { GoalId } from '../types';

const GOAL_CONFIG: Record<GoalId, { label: string; emoji: string; color: string }> = {
  dsa_partner:          { label: 'DSA Partner',         emoji: '🧠', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  project_collaborator: { label: 'Project Collab',      emoji: '🚀', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  hackathon_teammate:   { label: 'Hackathon Crew',      emoji: '⚡', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  internship_prep:      { label: 'Internship Prep',     emoji: '💼', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  mock_interview:       { label: 'Mock Interview',      emoji: '🎯', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  open_source:          { label: 'Open Source',         emoji: '🌐', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  learn_tech:           { label: 'Learn New Tech',      emoji: '📚', color: 'bg-orange-50 text-orange-700 border-orange-200' },
};

interface GoalChipProps {
  goalId: GoalId;
  selected?: boolean;
  onClick?: () => void;
}

export default function GoalChip({ goalId, selected, onClick }: GoalChipProps) {
  const config = GOAL_CONFIG[goalId] || { label: goalId, emoji: '✦', color: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold transition-all ${config.color} ${onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} ${selected ? 'ring-2 ring-indigo-500 shadow-sm' : ''}`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </button>
  );
}

