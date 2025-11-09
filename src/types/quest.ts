export type QuestCategory = 'explore' | 'social' | 'creative' | 'wellness' | 'learning';
export type QuestDifficulty = 'easy' | 'medium' | 'hard';
export type QuestStatus = 'current' | 'completed' | 'upcoming';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  duration: number; // in minutes
  location: string;
  status: QuestStatus;
  createdAt: Date;
  completedAt?: Date;
  photo?: string;
  notes?: string;
  xpReward: number;
}

export interface QuestFilters {
  timeAvailable: number; // in minutes
  location: 'indoor' | 'outdoor' | 'any';
  categories: QuestCategory[];
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalQuestsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}
