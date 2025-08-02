import { Card } from './ui/card';
import { Users, Star, UtensilsCrossed, PartyPopper } from 'lucide-react';
import { ReservationStats, ViewMode, FilterType } from '../types/reservation';

interface StatisticsGridProps {
  stats: ReservationStats;
  viewMode: ViewMode;
  activeFilter: FilterType;
  onFilterClick: (filter: FilterType) => void;
}

export function StatisticsGrid({ stats, viewMode, activeFilter, onFilterClick }: StatisticsGridProps) {
  const { totalReservations, vipCount, dietaryCount, celebrationCount } = stats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <Card 
        className={`p-3 border-2 cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        }`}
        onClick={() => onFilterClick('all')}
      >
        <div className="flex items-center justify-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-lg font-medium">{totalReservations}</span>
          <span className="text-m text-muted-foreground">All</span>
        </div>
      </Card>
      
      <Card 
        className={`p-3 border-2 cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'dietary' ? 'ring-2 ring-red-500 bg-red-50' : ''
        }`}
        onClick={() => onFilterClick('dietary')}
      >
        <div className="flex items-center justify-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-red-600" />
          <span className="text-lg font-medium">{dietaryCount}</span>
          <span className="text-m text-muted-foreground">Dietary Needs</span>
        </div>
      </Card>

      <Card 
        className={`p-3 border-2 cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'vip' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
        }`}
        onClick={() => onFilterClick('vip')}
      >
        <div className="flex items-center justify-center gap-2">
          <Star className="w-4 h-4 text-yellow-600" />
          <span className="text-lg font-medium">{vipCount}</span>
          <span className="text-m text-muted-foreground">VIP</span>
        </div>
      </Card>
      
      <Card 
        className={`p-3 border-2 cursor-pointer transition-all hover:shadow-md ${
          activeFilter === 'celebrations' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
        }`}
        onClick={() => onFilterClick('celebrations')}
      >
        <div className="flex items-center justify-center gap-2">
          <PartyPopper className="w-4 h-4 text-purple-600" />
          <span className="text-lg font-medium">{celebrationCount}</span>
          <span className="text-m text-muted-foreground">Celebrations</span>
        </div>
      </Card>
    </div>
  );
}