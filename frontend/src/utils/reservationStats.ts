import { Reservation, ReservationStats } from '../types/reservation';

export function calculateReservationStats(reservations: Reservation[]): ReservationStats {
  return {
    totalReservations: reservations.length,
    vipCount: reservations.filter(r => r.isVip).length,
    dietaryCount: reservations.filter(r => r.dietaryRestrictions.length > 0).length,
    celebrationCount: reservations.filter(r => r.specialOccasion).length,
  };
}