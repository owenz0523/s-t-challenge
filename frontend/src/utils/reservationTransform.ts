import { ApiProfile, Reservation } from '../types/reservation';

// Transform API profile to reservation format
export const transformProfileToReservation = (profile: ApiProfile, index: number): Reservation => {
  const time = "5:30 PM";
  
  // Determine if guest is VIP based on priority or special requests
  const isVip = profile.priority === 'VIP' || 
                profile.special_requests.some(req => 
                  req.toLowerCase().includes('vip') || 
                  req.toLowerCase().includes('private')
                );
  
  // Combine dietary restrictions and allergies
  const dietaryRestrictions = [
    ...profile.dietary_restrictions.filter(dr => dr && dr !== 'None'),
    ...profile.allergies.filter(allergy => allergy && allergy !== 'None')
  ];
  
  // Extract accessibility needs from special requests
  const accessibility = profile.special_requests.find(req => 
    req.toLowerCase().includes('wheelchair') || 
    req.toLowerCase().includes('accessibility') ||
    req.toLowerCase().includes('cane') ||
    req.toLowerCase().includes('step-free')
  ) || null;
  
  return {
    id: index + 1,
    guestName: profile.name,
    partySize: profile.people,
    time,
    isVip,
    dietaryRestrictions,
    specialOccasion: profile.special_occassion || null,
    accessibility,
    guestHistory: profile.staff_notes,
    conversationStarters: profile.conversation,
    specialRequests: profile.special_requests.join(', '),
    kitchenNotes: profile.staff_notes
  };
};