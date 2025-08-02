import { ViewMode } from '../types/reservation';
import { useReservations } from '../hooks/useReservations';
import { useReservationFilters } from '../hooks/useReservationFilters';
import { calculateReservationStats } from '../utils/reservationStats';
import { DashboardHeader } from './DashboardHeader';
import { StatisticsGrid } from './StatisticsGrid';
import { ReservationsList } from './ReservationsList';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

interface DashboardProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function Dashboard({ viewMode, onViewModeChange }: DashboardProps) {
  const { reservations, loading, error } = useReservations();
  const { activeFilter, filteredReservations, handleFilterClick, setActiveFilter } = 
    useReservationFilters(reservations, viewMode);
  const stats = calculateReservationStats(reservations);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <DashboardHeader viewMode={viewMode} onViewModeChange={onViewModeChange} />
      <StatisticsGrid 
        stats={stats} 
        viewMode={viewMode} 
        activeFilter={activeFilter} 
        onFilterClick={handleFilterClick} 
      />
      <ReservationsList 
        reservations={filteredReservations}
        activeFilter={activeFilter}
        totalCount={reservations.length}
        viewMode={viewMode}
        onClearFilter={() => setActiveFilter('all')}
      />
    </div>
  );
}