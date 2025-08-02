import { Button } from './ui/button';
import { UserCheck, ChefHat } from 'lucide-react';
import { ViewMode } from '../types/reservation';

interface DashboardHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function DashboardHeader({ viewMode, onViewModeChange }: DashboardHeaderProps) {
  return (
    <div className="mb-6 text-center">
      <div className="flex flex-col items-center mb-4">
        <div>
          <h1 className="text-5xl font-medium text-foreground">Morning Huddle</h1>
          <p className="text-2xl text-muted-foreground">Thursday, July 31, 2025</p>
        </div>
      </div>

      {/* View Toggle Buttons */}
      <div className="flex gap-4 mb-6 justify-center">
        <Button
          variant={viewMode === 'front-of-house' ? 'default' : 'outline'}
          onClick={() => onViewModeChange('front-of-house')}
          className="flex items-center gap-3 px-8 py-4 text-lg"
          size="lg"
        >
          <UserCheck className="w-6 h-6" />
          Front of House
        </Button>
        <Button
          variant={viewMode === 'back-of-house' ? 'default' : 'outline'}
          onClick={() => onViewModeChange('back-of-house')}
          className="flex items-center gap-3 px-8 py-4 text-lg"
          size="lg"
        >
          <ChefHat className="w-6 h-6" />
          Back of House
        </Button>
      </div>
    </div>
  );
}