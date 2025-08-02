import { Button } from './ui/button';

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background p-4 pb-20 flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium text-red-600 mb-2">Error loading reservations</div>
        <div className="text-muted-foreground mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    </div>
  );
}