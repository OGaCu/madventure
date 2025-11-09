import { Quest, QuestFilters, UserProfile, Achievement } from '@/types/quest';

// Mock quest templates
const questTemplates = [
  // Explore
  { title: 'Find a Hidden Gem', description: 'Discover a local spot you\'ve never been to within 10 blocks', category: 'explore' as const, duration: 30, location: 'outdoor', xpReward: 50 },
  { title: 'Coffee Shop Explorer', description: 'Try a new coffee shop and order something you\'ve never had', category: 'explore' as const, duration: 45, location: 'indoor', xpReward: 40 },
  { title: 'Street Art Hunt', description: 'Find and photograph 3 pieces of street art in your neighborhood', category: 'explore' as const, duration: 60, location: 'outdoor', xpReward: 60 },
  { title: 'Quick Walk', description: 'Take a 5-minute walk around the block', category: 'explore' as const, duration: 5, location: 'outdoor', xpReward: 20 },
  
  // Social
  { title: 'Random Act of Kindness', description: 'Do something nice for a stranger today', category: 'social' as const, duration: 15, location: 'any', xpReward: 45 },
  { title: 'Strike Up a Conversation', description: 'Have a 5-minute conversation with someone new', category: 'social' as const, duration: 20, location: 'any', xpReward: 50 },
  { title: 'Compliment Giver', description: 'Give genuine compliments to 3 different people', category: 'social' as const, duration: 30, location: 'any', xpReward: 40 },
  { title: 'Quick Chat', description: 'Say hello to someone you pass by', category: 'social' as const, duration: 2, location: 'any', xpReward: 15 },
  
  // Creative
  { title: 'Sketch Your Surroundings', description: 'Spend 15 minutes sketching what you see around you', category: 'creative' as const, duration: 20, location: 'any', xpReward: 45 },
  { title: 'Write a Haiku', description: 'Write 3 haikus inspired by your current location', category: 'creative' as const, duration: 15, location: 'any', xpReward: 35 },
  { title: 'Photo Challenge', description: 'Take 10 photos following a theme (colors, patterns, emotions)', category: 'creative' as const, duration: 30, location: 'outdoor', xpReward: 50 },
  { title: 'Quick Doodle', description: 'Draw something you see right now', category: 'creative' as const, duration: 5, location: 'any', xpReward: 20 },
  
  // Wellness
  { title: 'Mindful Walk', description: 'Take a 15-minute walk focusing on your senses', category: 'wellness' as const, duration: 20, location: 'outdoor', xpReward: 40 },
  { title: 'Breathing Break', description: 'Practice deep breathing exercises for 10 minutes', category: 'wellness' as const, duration: 10, location: 'any', xpReward: 30 },
  { title: 'Stretch Session', description: 'Do a full body stretch routine', category: 'wellness' as const, duration: 15, location: 'indoor', xpReward: 35 },
  { title: 'Deep Breath', description: 'Take 5 deep breaths', category: 'wellness' as const, duration: 1, location: 'any', xpReward: 10 },
  
  // Learning
  { title: 'Learn 5 New Words', description: 'Learn 5 words in a language you\'re interested in', category: 'learning' as const, duration: 20, location: 'any', xpReward: 40 },
  { title: 'Podcast Episode', description: 'Listen to an educational podcast episode', category: 'learning' as const, duration: 30, location: 'any', xpReward: 45 },
  { title: 'Read & Reflect', description: 'Read an article on a topic you know nothing about', category: 'learning' as const, duration: 25, location: 'any', xpReward: 40 },
  { title: 'Quick Read', description: 'Read one interesting fact', category: 'learning' as const, duration: 3, location: 'any', xpReward: 15 },
];

const achievements: Achievement[] = [
  { id: '1', title: 'First Steps', description: 'Complete your first quest', icon: '🎯', unlockedAt: undefined },
  { id: '2', title: 'Explorer', description: 'Complete 10 quests', icon: '🗺️', unlockedAt: undefined },
  { id: '3', title: 'Adventurer', description: 'Complete 25 quests', icon: '⚔️', unlockedAt: undefined },
  { id: '4', title: 'Streak Master', description: 'Maintain a 7-day streak', icon: '🔥', unlockedAt: undefined },
  { id: '5', title: 'Social Butterfly', description: 'Complete 10 social quests', icon: '🦋', unlockedAt: undefined },
  { id: '6', title: 'Creative Mind', description: 'Complete 10 creative quests', icon: '🎨', unlockedAt: undefined },
  { id: '7', title: 'Wellness Warrior', description: 'Complete 10 wellness quests', icon: '💪', unlockedAt: undefined },
  { id: '8', title: 'Knowledge Seeker', description: 'Complete 10 learning quests', icon: '📚', unlockedAt: undefined },
];

export function generateQuest(filters: QuestFilters): Quest {
  const filteredTemplates = questTemplates.filter(template => {
    const matchesTime = template.duration <= filters.timeAvailable;
    const matchesLocation = filters.location === 'any' || template.location === 'any' || template.location === filters.location;
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(template.category);
    return matchesTime && matchesLocation && matchesCategory;
  });

  if (filteredTemplates.length === 0) {
    const template = questTemplates[Math.floor(Math.random() * questTemplates.length)];
    return createQuestFromTemplate(template);
  }

  const template = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];
  return createQuestFromTemplate(template);
}

function createQuestFromTemplate(template: typeof questTemplates[0]): Quest {
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: template.title,
    description: template.description,
    category: template.category,
    difficulty: template.duration <= 20 ? 'easy' : template.duration <= 40 ? 'medium' : 'hard',
    duration: template.duration,
    location: template.location,
    status: 'current',
    createdAt: new Date(),
    xpReward: template.xpReward,
  };
}

export function getInitialUserProfile(): UserProfile {
  return {
    name: 'Adventurer',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalQuestsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: achievements,
  };
}

export function calculateLevel(xp: number): { level: number; xpToNextLevel: number } {
  let level = 1;
  let xpRequired = 100;
  let totalXpForLevel = 0;

  while (xp >= totalXpForLevel + xpRequired) {
    totalXpForLevel += xpRequired;
    level++;
    xpRequired = Math.floor(xpRequired * 1.5);
  }

  return {
    level,
    xpToNextLevel: totalXpForLevel + xpRequired - xp,
  };
}

export function checkAchievements(profile: UserProfile, quests: Quest[]): Achievement[] {
  const completedQuests = quests.filter(q => q.status === 'completed');
  const newAchievements: Achievement[] = [];

  profile.achievements.forEach(achievement => {
    if (achievement.unlockedAt) return;

    let shouldUnlock = false;

    switch (achievement.id) {
      case '1':
        shouldUnlock = completedQuests.length >= 1;
        break;
      case '2':
        shouldUnlock = completedQuests.length >= 10;
        break;
      case '3':
        shouldUnlock = completedQuests.length >= 25;
        break;
      case '4':
        shouldUnlock = profile.currentStreak >= 7;
        break;
      case '5':
        shouldUnlock = completedQuests.filter(q => q.category === 'social').length >= 10;
        break;
      case '6':
        shouldUnlock = completedQuests.filter(q => q.category === 'creative').length >= 10;
        break;
      case '7':
        shouldUnlock = completedQuests.filter(q => q.category === 'wellness').length >= 10;
        break;
      case '8':
        shouldUnlock = completedQuests.filter(q => q.category === 'learning').length >= 10;
        break;
    }

    if (shouldUnlock) {
      achievement.unlockedAt = new Date();
      newAchievements.push(achievement);
    }
  });

  return newAchievements;
}