import { useState, useEffect } from 'react';
import { Reservation, ApiResponse } from '../types/reservation';
import { transformProfileToReservation } from '../utils/reservationTransform';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/profiles');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      const transformedReservations = data.profiles.map(transformProfileToReservation);
      setReservations(transformedReservations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return { 
    reservations, 
    loading, 
    error, 
    refetch: fetchProfiles 
  };
}