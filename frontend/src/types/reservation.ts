export interface ApiProfile {
  name: string;
  date: string;
  people: number;
  dietary_restrictions: string[];
  allergies: string[];
  special_occassion: string;
  priority: string;
  special_requests: string[];
  staff_notes: string;
  conversation: string[];
}

export interface ApiResponse {
  generated_at: string;
  total_reservations: number;
  vip_count: number;
  dietary_count: number;
  special_occasion_count: number;
  profiles: ApiProfile[];
}

export interface Reservation {
  id: number;
  guestName: string;
  partySize: number;
  time: string;
  isVip: boolean;
  dietaryRestrictions: string[];
  specialOccasion: string | null;
  accessibility: string | null;
  guestHistory: string;
  conversationStarters: string[];
  specialRequests: string;
  kitchenNotes: string;
}

export type ViewMode = 'front-of-house' | 'back-of-house';

export type FilterType = 'all' | 'vip' | 'dietary' | 'celebrations';

export interface ReservationStats {
  totalReservations: number;
  vipCount: number;
  dietaryCount: number;
  celebrationCount: number;
}