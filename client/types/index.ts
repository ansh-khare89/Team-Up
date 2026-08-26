export type ActivityStatus = 'Actively Looking' | 'Open to Opportunities' | 'Not Looking Right Now';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Skill {
  id?: number;
  name: string;
  level: SkillProficiency;
  category: string;
}

export type GoalId = 
  | 'dsa_partner'
  | 'project_collaborator'
  | 'hackathon_teammate'
  | 'internship_prep'
  | 'mock_interview'
  | 'open_source'
  | 'learn_tech';

export interface DSAProfile {
  id?: number;
  platform: 'LeetCode' | 'Codeforces' | 'HackerRank';
  experienceLevel: SkillProficiency;
  preferredLanguage: string;
  dailyGoal: number;
  preferredTime: string;
  streakCount: number;
  lastCheckIn?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  college: string;
  branch: string;
  yearOfStudy: string;
  year?: string;
  bio?: string;
  skills: Skill[];
  currentGoals: GoalId[];
  availabilityDays: string[];
  availabilityTime: string;
  activityStatus: ActivityStatus;
  github?: string;
  linkedin?: string;
  leetcode?: string;
  portfolio?: string;
  dsaProfile?: DSAProfile;
  onboarded: boolean;
  lastActive?: string;
}

export interface MatchScoreBreakdown {
  complementarySkillsScore: number;
  goalMatchScore: number;
  commonSkillsScore: number;
  experienceScore: number;
  availabilityScore: number;
  activityScore: number;
}

export interface MatchResult {
  userId: string;
  compatibilityPercentage: number;
  breakdown: Record<string, number>;
  whyThisMatch: string[];
}

export interface StudentMatch {
  student: User;
  match: MatchResult;
}

export interface Connection {
  id: string;
  user: User;
  status: 'Pending' | 'Accepted' | 'Declined';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  connectionId: string;
  user: User;
  lastMessage?: Message;
  unreadCount: number;
}

export interface Opportunity {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  creator?: User;
  interestedUsers?: User[];
  isInterested?: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  senderId?: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
