import { GoalId } from '../types';

const GOAL_CONFIG: Record<GoalId, { label: string; emoji: string; color: string }> = {
  dsa_partner:         { label: 'DSA Partner',         emoji: '🧠', color: 'bg-violet-500/15 text-violet-400 border-violet-500/25' },
  project_collaborator:{ label: 'Project Collaborator', emoji: '🚀', color: 'bg-blue-500/15   text-blue-400   border-blue-500/25'   },
  hackathon_teammate:  { label: 'Hackathon Teammate',   emoji: '⚡', color: 'bg-amber-500/15  text-amber-400  border-amber-500/25'  },
  internship_prep:     { label: 'Internship Prep',      emoji: '💼', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'},
  mock_interview:      { label: 'Mock Interviews',      emoji: '🎯', color: 'bg-rose-500/15   text-rose-400   border-rose-500/25'   },
  open_source:         { label: 'Open Source',          emoji: '🌐', color: 'bg-teal-500/15   text-teal-400   border-teal-500/25'   },
  learn_tech:          { label: 'Learn New Tech',       emoji: '📚', color: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
};

interface GoalChipProps {
  goalId: GoalId;
  selected?: boolean;
  onClick?: () => void;
}

export default function GoalChip({ goalId, selected, onClick }: GoalChipProps) {
  const config = GOAL_CONFIG[goalId] || { label: goalId, emoji: '✦', color: 'bg-slate-700 text-slate-300 border-slate-600' };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${config.color} ${onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} ${selected ? 'ring-2 ring-offset-1 ring-offset-slate-900 ring-indigo-500' : ''}`}
    >
      <span>{config.emoji}</span>
      {config.label}
    </button>
  );
}
