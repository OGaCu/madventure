import { UserProfile } from '@/types/quest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Target, Flame, Award } from 'lucide-react';

interface UserProfileCardProps {
  profile: UserProfile;
  totalQuests: number;
  currentQuests: number;
}

export default function UserProfileCard({ profile, totalQuests, currentQuests }: UserProfileCardProps) {
  const xpProgress = ((profile.xp % 100) / profile.xpToNextLevel) * 100;
  const unlockedAchievements = profile.achievements.filter(a => a.unlockedAt);

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          {profile.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level & XP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                Level {profile.level}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {profile.xp} XP
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {profile.xpToNextLevel} XP to next level
            </span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-background rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs">Total Quests</span>
            </div>
            <p className="text-2xl font-bold">{profile.totalQuestsCompleted}</p>
          </div>

          <div className="p-3 bg-background rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs">Active Quests</span>
            </div>
            <p className="text-2xl font-bold">{currentQuests}</p>
          </div>

          <div className="p-3 bg-background rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs">Current Streak</span>
            </div>
            <p className="text-2xl font-bold">{profile.currentStreak} days</p>
          </div>

          <div className="p-3 bg-background rounded-lg border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs">Achievements</span>
            </div>
            <p className="text-2xl font-bold">
              {unlockedAchievements.length}/{profile.achievements.length}
            </p>
          </div>
        </div>

        {/* Recent Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Award className="w-4 h-4" />
              Recent Achievements
            </h4>
            <div className="flex flex-wrap gap-2">
              {unlockedAchievements.slice(-3).map(achievement => (
                <Badge
                  key={achievement.id}
                  variant="secondary"
                  className="text-base px-3 py-1"
                  title={achievement.description}
                >
                  {achievement.icon} {achievement.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
