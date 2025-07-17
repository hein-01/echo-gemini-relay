import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageProps {
  content: string;
  isAI: boolean;
  timestamp: string;
}

const Message: React.FC<MessageProps> = ({ content, isAI, timestamp }) => {
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg",
      isAI ? "bg-secondary/50" : "bg-primary/5"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarFallback className={cn(
          "text-xs",
          isAI ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
        )}>
          {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isAI ? 'AI Assistant' : 'You'}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>
        <div className="text-sm whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Message;