import { Button } from './ui/button';
import { GuestCard } from './GuestCard';
import { Reservation, ViewMode, FilterType } from '../types/reservation';

interface ReservationsListProps {
  reservations: Reservation[];
  activeFilter: FilterType;
  totalCount: number;
  viewMode: ViewMode;
  onClearFilter: () => void;
}

export function ReservationsList({ 
  reservations, 
  activeFilter, 
  totalCount, 
  viewMode, 
  onClearFilter 
}: ReservationsListProps) {
  const isBackOfHouse = viewMode === 'back-of-house';

  return (
    <div>
      <h2 className="text-3xl font-medium text-foreground mb-3 text-center">
        {isBackOfHouse ? "Kitchen Prep Notes" : "Tonight's Reservations"}
        {activeFilter !== 'all' && (
          <span className="text-xl text-muted-foreground ml-2">
            ({reservations.length} of {totalCount})
          </span>
        )}
      </h2>
      
      {activeFilter !== 'all' && (
        <div className="text-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilter}
            className="text-sm"
          >
            Clear Filter
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reservations.map((reservation) => (
          <GuestCard 
            key={reservation.id} 
            reservation={reservation} 
            viewMode={viewMode}
          />
        ))}
      </div>
      
      {reservations.length === 0 && activeFilter !== 'all' && (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-lg">
            No reservations match the current filter.
          </p>
        </div>
      )}
    </div>
  );
}