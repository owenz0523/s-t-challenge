import { useState, useEffect, useMemo } from 'react';
import { Reservation, ViewMode, FilterType } from '../types/reservation';

export function useReservationFilters(reservations: Reservation[], viewMode: ViewMode) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Reset filter when view mode changes
  useEffect(() => {
    setActiveFilter('all');
  }, [viewMode]);

  const filteredReservations = useMemo(() => {
    return reservations.filter(reservation => {
      switch (activeFilter) {
        case 'vip':
          return reservation.isVip;
        case 'dietary':
          return reservation.dietaryRestrictions.length > 0;
        case 'celebrations':
          return reservation.specialOccasion !== null;
        case 'all':
        default:
          return true;
      }
    });
  }, [reservations, activeFilter]);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(activeFilter === filter ? 'all' : filter);
  };

  return {
    activeFilter,
    filteredReservations,
    handleFilterClick,
    setActiveFilter
  };
}