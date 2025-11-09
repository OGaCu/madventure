import { useState, useEffect } from 'react';
import { Quest, UserProfile } from '@/types/quest';
import { getInitialUserProfile, calculateLevel, checkAchievements } from '@/lib/questService';

const STORAGE_KEYS = {
  QUESTS: 'micro-adventure-quests',
  PROFILE: 'micro-adventure-profile',
};

export function useQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [profile, setProfile] = useState<UserProfile>(getInitialUserProfile());

  useEffect(() => {
    const savedQuests = localStorage.getItem(STORAGE_KEYS.QUESTS);
    const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);

    if (savedQuests) {
      const parsed = JSON.parse(savedQuests);
      setQuests(parsed.map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt),
        completedAt: q.completedAt ? new Date(q.completedAt) : undefined,
      })));
    }

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({
        ...parsed,
        achievements: parsed.achievements.map((a: any) => ({
          ...a,
          unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined,
        })),
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  const addQuest = (quest: Quest) => {
    setQuests(prev => [...prev, quest]);
  };

  const completeQuest = (questId: string, photo?: string, notes?: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          status: 'completed' as const,
          completedAt: new Date(),
          photo,
          notes,
        };
      }
      return q;
    }));

    const quest = quests.find(q => q.id === questId);
    if (quest) {
      const newXp = profile.xp + quest.xpReward;
      const { level, xpToNextLevel } = calculateLevel(newXp);
      
      const updatedProfile = {
        ...profile,
        xp: newXp,
        level,
        xpToNextLevel,
        totalQuestsCompleted: profile.totalQuestsCompleted + 1,
      };

      const newAchievements = checkAchievements(updatedProfile, [...quests.map(q => q.id === questId ? { ...q, status: 'completed' as const } : q)]);
      
      setProfile(updatedProfile);

      return { levelUp: level > profile.level, newAchievements };
    }

    return { levelUp: false, newAchievements: [] };
  };

  const deleteQuest = (questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
  };

  return {
    quests,
    profile,
    addQuest,
    completeQuest,
    deleteQuest,
  };
}