import { GoalId } from '../types';

const GOAL_CONFIG: Record<GoalId, { label: string; emoji: string; color: string }> = {
  dsa_partner:          { label: 'DSA Partner',         emoji: '🧠', color: 'bg-violet-500/10 text-violet-400 border border-violet-500/20' },
  project_collaborator: { label: 'Project Collab',      emoji: '🚀', color: 'bg-sky-500/10 text-sky-400 border border-sky-500/20' },
  hackathon_teammate:   { label: 'Hackathon Crew',      emoji: '⚡', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  internship_prep:      { label: 'Internship Prep',     emoji: '💼', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  mock_interview:       { label: 'Mock Interview',      emoji: '🎯', color: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' },
  open_source:          { label: 'Open Source',         emoji: '🌐', color: 'bg-teal-500/10 text-teal-400 border border-teal-500/20' },
  learn_tech:           { label: 'Learn New Tech',      emoji: '📚', color: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
};

interface GoalChipProps {
  goalId: GoalId;
  selected?: boolean;
  onClick?: () => void;
}

export default function GoalChip({ goalId, selected, onClick }: GoalChipProps) {
  const config = GOAL_CONFIG[goalId] || { label: goalId, emoji: '✦', color: 'bg-zinc-500/10 text-zinc-400 border border-zinc-600/20' };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${config.color} ${onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} ${selected ? 'ring-2 ring-violet-500 shadow-md' : ''}`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </button>
  );
}
