import { useState } from 'react';
import { Quest } from '@/types/quest';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Zap, Camera, FileText } from 'lucide-react';

interface QuestDetailsModalProps {
  quest: Quest | null;
  onClose: () => void;
  onComplete?: (questId: string, photo?: string, notes?: string) => void;
}

export default function QuestDetailsModal({ quest, onClose, onComplete }: QuestDetailsModalProps) {
  const [notes, setNotes] = useState(quest?.notes || '');
  const [photoUrl, setPhotoUrl] = useState(quest?.photo || '');
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  if (!quest) return null;

  const isCompleted = quest.status === 'completed';

  const handleComplete = () => {
    if (onComplete) {
      onComplete(quest.id, photoUrl || undefined, notes || undefined);
      onClose();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
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
    <Dialog open={!!quest} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-2">
            <DialogTitle className="text-2xl">{quest.title}</DialogTitle>
            <Badge className={`${getDifficultyColor(quest.difficulty)} text-white`}>
              {quest.difficulty}
            </Badge>
          </div>
          <DialogDescription className="text-base pt-2">
            {quest.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {quest.duration} minutes
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {quest.location}
            </Badge>
            <Badge className={`${getCategoryColor(quest.category)} text-white`}>
              {quest.category}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              +{quest.xpReward} XP Reward
            </Badge>
          </div>

          {isCompleted && (
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="font-semibold text-green-800 dark:text-green-200">✓ Quest Completed!</p>
              {quest.completedAt && (
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Completed on {new Date(quest.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {(isCompleted || showCompletionForm) && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Quest Memory
              </h3>

              {quest.photo && (
                <div className="space-y-2">
                  <Label>Photo</Label>
                  <img
                    src={quest.photo}
                    alt="Quest completion"
                    className="w-full rounded-lg border"
                  />
                </div>
              )}

              {!isCompleted && (
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo URL (optional)</Label>
                  <div className="flex gap-2">
                    <Camera className="w-5 h-5 text-muted-foreground mt-2" />
                    <Input
                      id="photo"
                      placeholder="https://example.com/photo.jpg"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paste a URL to an image from Unsplash or any other source
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="How did it go? What did you discover?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  disabled={isCompleted}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            {isCompleted ? 'Close' : 'Cancel'}
          </Button>
          {!isCompleted && !showCompletionForm && (
            <Button onClick={() => setShowCompletionForm(true)}>
              Complete Quest
            </Button>
          )}
          {!isCompleted && showCompletionForm && (
            <Button onClick={handleComplete}>
              Save & Complete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
