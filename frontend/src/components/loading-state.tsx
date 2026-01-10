import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  onCancel?: () => void;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Загрузка данных...",
  onCancel,
  className = ""
}) => {
  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{message}</p>
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Отмена
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface SavingStateProps {
  message?: string;
  className?: string;
}

export const SavingState: React.FC<SavingStateProps> = ({
  message = "Сохранение...",
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
};
