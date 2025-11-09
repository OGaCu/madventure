import { Quest } from '@/types/quest';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Zap, CheckCircle2, Trash2, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

interface QuestCardProps {
  quest: Quest;
  onComplete?: (questId: string) => void;
  onDelete?: (questId: string) => void;
  onViewDetails?: (quest: Quest) => void;
}

export default function QuestCard({ quest, onComplete, onDelete, onViewDetails }: QuestCardProps) {
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

  const isCompleted = quest.status === 'completed';

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isCompleted ? 'bg-muted/30' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-bold text-lg ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
            {quest.title}
          </h3>
          <Badge className={`${getDifficultyColor(quest.difficulty)} text-white shrink-0`}>
            {quest.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className={`text-sm ${isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>
          {quest.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {quest.duration} min
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {quest.location}
          </Badge>
          <Badge className={`${getCategoryColor(quest.category)} text-white`}>
            {quest.category}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            +{quest.xpReward} XP
          </Badge>
        </div>

        {isCompleted && quest.completedAt && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Completed on {format(quest.completedAt, 'MMM d, yyyy')}
            </p>
            {(quest.photo || quest.notes) && (
              <div className="flex gap-2 mt-2">
                {quest.photo && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Photo
                  </Badge>
                )}
                {quest.notes && (
                  <Badge variant="outline">Notes</Badge>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-3">
        {!isCompleted && onComplete && (
          <Button
            onClick={() => onComplete(quest.id)}
            className="flex-1"
            size="sm"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Complete
          </Button>
        )}
        {onViewDetails && (
          <Button
            onClick={() => onViewDetails(quest)}
            variant={isCompleted ? 'default' : 'secondary'}
            className="flex-1"
            size="sm"
          >
            View Details
          </Button>
        )}
        {onDelete && (
          <Button
            onClick={() => onDelete(quest.id)}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
