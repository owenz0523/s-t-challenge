import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { GuestCard } from './GuestCard';
import { Users, Star, UtensilsCrossed, PartyPopper, ChefHat, UserCheck } from 'lucide-react';

export type ViewMode = 'front-of-house' | 'back-of-house';

interface DashboardProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

interface ApiProfile {
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

interface ApiResponse {
  generated_at: string;
  total_reservations: number;
  vip_count: number;
  dietary_count: number;
  special_occasion_count: number;
  profiles: ApiProfile[];
}

interface Reservation {
  id: number;
  guestName: string;
  partySize: number;
  time: string;
  isVip: boolean;
  dietaryRestrictions: string[];
  specialOccasion: string | null;
  accessibility: string | null;
  guestHistory: string;
  favoriteItems: string[];
  conversationStarters: string[];
  specialRequests: string;
  lastVisit: string | null;
  kitchenNotes: string;
}


// Transform API profile to reservation format
const transformProfileToReservation = (profile: ApiProfile, index: number): Reservation => {
 const time = "5:30 PM"
  
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
    favoriteItems: [], // Not available in API data
    conversationStarters: profile.conversation,
    specialRequests: profile.special_requests.join(', '),
    lastVisit: null, // Not available in API data
    kitchenNotes: profile.staff_notes
  };
};

export function Dashboard({ viewMode, onViewModeChange }: DashboardProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchProfiles();
  }, []);

  const totalReservations = reservations.length;
  const vipCount = reservations.filter(r => r.isVip).length;
  const dietaryCount = reservations.filter(r => r.dietaryRestrictions.length > 0).length;
  const celebrationCount = reservations.filter(r => r.specialOccasion).length;
  const severeAllergyCount = reservations.filter(r => 
    r.dietaryRestrictions.some(restriction => 
      restriction.toLowerCase().includes('allergy') && restriction.toLowerCase().includes('severe')
    )
  ).length;

  const isBackOfHouse = viewMode === 'back-of-house';

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-foreground mb-2">Loading reservations...</div>
          <div className="text-muted-foreground">Please wait while we fetch the data</div>
        </div>
      </div>
    );
  }

  if (error) {
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

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-5xl font-medium text-foreground">Morning Huddle</h1>
            <p className="text-2xl text-muted-foreground">Thursday, July 31, 2025</p>
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex gap-4 mb-6">
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {isBackOfHouse ? (
            // Back of House Stats
            <>
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="text-lg font-medium">{severeAllergyCount}</div>
                    <div className="text-xs text-muted-foreground">Severe Allergies</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="text-lg font-medium">{dietaryCount}</div>
                    <div className="text-xs text-muted-foreground">Dietary Needs</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <PartyPopper className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-lg font-medium">{celebrationCount}</div>
                    <div className="text-xs text-muted-foreground">Special Orders</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-lg font-medium">{totalReservations}</div>
                    <div className="text-xs text-muted-foreground">Total Covers</div>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            // Front of House Stats
            <>
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-lg font-medium">{totalReservations}</div>
                    <div className="text-xs text-muted-foreground">Reservation</div>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="text-lg font-medium">{dietaryCount}</div>
                    <div className="text-xs text-muted-foreground">Dietary Needs</div>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <div>
                    <div className="text-lg font-medium">{vipCount}</div>
                    <div className="text-xs text-muted-foreground">VIP Guests</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <PartyPopper className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-lg font-medium">{celebrationCount}</div>
                    <div className="text-xs text-muted-foreground">Celebrations</div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Guest Cards */}
      <div>
        <h2 className="text-lg font-medium text-foreground mb-3">
          {isBackOfHouse ? "Kitchen Prep Notes" : "Tonight's Reservations"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((reservation) => (
            <GuestCard 
              key={reservation.id} 
              reservation={reservation} 
              viewMode={viewMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}