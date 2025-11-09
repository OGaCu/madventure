import { useState } from 'react';
import { useQuests } from '@/hooks/useQuests';
import { Quest } from '@/types/quest';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import QuestGenerator from './QuestGenerator';
import QuestCard from './QuestCard';
import QuestDetailsModal from './QuestDetailsModal';
import UserProfileCard from './UserProfileCard';
import { Sparkles, Compass, CheckCircle2, Award, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

function Home() {
  const { quests, profile, addQuest, completeQuest, deleteQuest } = useQuests();
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const { toast } = useToast();

  const currentQuests = quests.filter(q => q.status === 'current');
  const completedQuests = quests.filter(q => q.status === 'completed');

  const handleAcceptQuest = (quest: Quest) => {
    addQuest(quest);
    toast({
      title: '🎉 Quest Accepted!',
      description: `"${quest.title}" has been added to your active quests.`,
    });
  };

  const handleCompleteQuest = (questId: string, photo?: string, notes?: string) => {
    const result = completeQuest(questId, photo, notes);
    const quest = quests.find(q => q.id === questId);
    
    if (result?.levelUp) {
      toast({
        title: '🎊 Level Up!',
        description: `Congratulations! You've reached level ${profile.level + 1}!`,
      });
    }
    
    if (result?.newAchievements && result.newAchievements.length > 0) {
      result.newAchievements.forEach(achievement => {
        toast({
          title: '🏆 Achievement Unlocked!',
          description: `${achievement.icon} ${achievement.title}`,
        });
      });
    }
    
    toast({
      title: '✅ Quest Completed!',
      description: `You earned ${quest?.xpReward || 0} XP!`,
    });
  };

  const handleDeleteQuest = (questId: string) => {
    deleteQuest(questId);
    toast({
      title: 'Quest Removed',
      description: 'The quest has been removed from your list.',
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Micro-Adventure Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Turn idle moments into opportunities for discovery
          </p>
        </div>

        {/* Profile Section */}
        <div className="mb-8">
          <UserProfileCard
            profile={profile}
            totalQuests={quests.length}
            currentQuests={currentQuests.length}
          />
        </div>

        {/* Map Section */}
        <Card className="mb-8 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Nearby Quest Locations
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Explore local spots for your next adventure
            </p>
          </div>
          <div className="relative w-full h-[400px] bg-muted">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24176.251819447224!2d-73.99185!3d40.74844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Quest Locations Map"
            />
          </div>
        </Card>

        {/* Generate Quest Button */}
        <div className="mb-8">
          <Button
            onClick={() => setShowGenerator(true)}
            size="lg"
            className="w-full md:w-auto text-lg h-14 px-8"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate New Quest
          </Button>
        </div>

        {/* Quests Tabs */}
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Current</span>
              <span className="sm:hidden">Active</span>
              {currentQuests.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                  {currentQuests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden">Done</span>
              {completedQuests.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                  {completedQuests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Achievements</span>
              <span className="sm:hidden">Awards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            {currentQuests.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed rounded-lg">
                <Compass className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Active Quests</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first micro-adventure to get started!
                </p>
                <Button onClick={() => setShowGenerator(true)}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Quest
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentQuests.map(quest => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onComplete={(id) => setSelectedQuest(quests.find(q => q.id === id) || null)}
                    onDelete={handleDeleteQuest}
                    onViewDetails={setSelectedQuest}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedQuests.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed rounded-lg">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Completed Quests Yet</h3>
                <p className="text-muted-foreground">
                  Complete your first quest to start building your adventure journal!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedQuests.map(quest => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onViewDetails={setSelectedQuest}
                    onDelete={handleDeleteQuest}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    achievement.unlockedAt
                      ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20'
                      : 'bg-muted/30 border-border opacity-60'
                  }`}
                >
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  {achievement.unlockedAt ? (
                    <p className="text-xs text-primary font-semibold">
                      ✓ Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">🔒 Locked</p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showGenerator && (
        <QuestGenerator
          onAcceptQuest={handleAcceptQuest}
          onClose={() => setShowGenerator(false)}
        />
      )}

      {selectedQuest && (
        <QuestDetailsModal
          quest={selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onComplete={handleCompleteQuest}
        />
      )}

      <Toaster />
    </div>
  );
}

export default Home;