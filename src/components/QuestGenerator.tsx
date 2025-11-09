import { useState } from 'react';
import { Quest, QuestFilters, QuestCategory } from '@/types/quest';
import { generateQuest } from '@/lib/questService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, MapPin, Zap } from 'lucide-react';

interface QuestGeneratorProps {
  onAcceptQuest: (quest: Quest) => void;
  onClose: () => void;
}

const categoryOptions: { value: QuestCategory; label: string; emoji: string }[] = [
  { value: 'explore', label: 'Explore', emoji: '🗺️' },
  { value: 'social', label: 'Social', emoji: '👥' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
  { value: 'wellness', label: 'Wellness', emoji: '💪' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
];

export default function QuestGenerator({ onAcceptQuest, onClose }: QuestGeneratorProps) {
  const [filters, setFilters] = useState<QuestFilters>({
    timeAvailable: 30,
    location: 'any',
    categories: [],
  });
  const [generatedQuest, setGeneratedQuest] = useState<Quest | null>(null);

  const handleGenerate = () => {
    const quest = generateQuest(filters);
    setGeneratedQuest(quest);
  };

  const handleAccept = () => {
    if (generatedQuest) {
      onAcceptQuest(generatedQuest);
      onClose();
    }
  };

  const toggleCategory = (category: QuestCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: QuestCategory) => {
    switch (category) {
      case 'explore': return 'bg-blue-500';
      case 'social': return 'bg-purple-500';
      case 'creative': return 'bg-pink-500';
      case 'wellness': return 'bg-green-500';
      case 'learning': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Generate Your Next Adventure
          </CardTitle>
          <CardDescription>
            Customize your quest preferences and let us create the perfect micro-adventure for you
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Time Available */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Time Available</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[filters.timeAvailable]}
                onValueChange={(value) => setFilters(prev => ({ ...prev, timeAvailable: value[0] }))}
                min={1}
                max={60}
                step={1}
                className="flex-1"
              />
              <div className="flex items-center gap-1 min-w-[80px]">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{filters.timeAvailable} min</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Location Preference</Label>
            <RadioGroup
              value={filters.location}
              onValueChange={(value: any) => setFilters(prev => ({ ...prev, location: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any" />
                <Label htmlFor="any" className="cursor-pointer">Any Location</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="indoor" id="indoor" />
                <Label htmlFor="indoor" className="cursor-pointer">Indoor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outdoor" id="outdoor" />
                <Label htmlFor="outdoor" className="cursor-pointer">Outdoor</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Quest Categories</Label>
            <p className="text-sm text-muted-foreground">Leave empty for all categories</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categoryOptions.map(option => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    filters.categories.includes(option.value)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleCategory(option.value)}
                >
                  <Checkbox
                    checked={filters.categories.includes(option.value)}
                    onCheckedChange={() => toggleCategory(option.value)}
                  />
                  <Label className="cursor-pointer flex items-center gap-2">
                    <span>{option.emoji}</span>
                    <span>{option.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Quest */}
          {generatedQuest && (
            <div className="mt-6 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border-2 border-primary/20">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold">{generatedQuest.title}</h3>
                <Badge className={`${getDifficultyColor(generatedQuest.difficulty)} text-white`}>
                  {generatedQuest.difficulty}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">{generatedQuest.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {generatedQuest.duration} min
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {generatedQuest.location}
                </Badge>
                <Badge className={`${getCategoryColor(generatedQuest.category)} text-white`}>
                  {generatedQuest.category}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  +{generatedQuest.xpReward} XP
                </Badge>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          {!generatedQuest ? (
            <Button onClick={handleGenerate} className="flex-1">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Quest
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handleGenerate} className="flex-1">
                Regenerate
              </Button>
              <Button onClick={handleAccept} className="flex-1">
                Accept Quest
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}