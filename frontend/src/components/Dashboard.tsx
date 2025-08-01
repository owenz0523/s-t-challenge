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
  conversationStarters: string[];
  specialRequests: string;
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
    conversationStarters: profile.conversation,
    specialRequests: profile.special_requests.join(', '),
    kitchenNotes: profile.staff_notes
  };
};

type FilterType = 'all' | 'vip' | 'dietary' | 'celebrations';

export function Dashboard({ viewMode, onViewModeChange }: DashboardProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

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

  // Reset filter when view mode changes
  useEffect(() => {
    setActiveFilter('all');
  }, [viewMode]);

  const totalReservations = reservations.length;
  const vipCount = reservations.filter(r => r.isVip).length;
  const dietaryCount = reservations.filter(r => r.dietaryRestrictions.length > 0).length;
  const celebrationCount = reservations.filter(r => r.specialOccasion).length;

  const isBackOfHouse = viewMode === 'back-of-house';

  // Filter reservations based on active filter
  const filteredReservations = reservations.filter(reservation => {
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

  // Handle filter clicks
  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(activeFilter === filter ? 'all' : filter);
  };

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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {isBackOfHouse ? (
            // Back of House Stats
            <>
              <Card 
                className={`p-3 border-2 cursor-pointer transition-all hover:shadow-md ${
                  activeFilter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleFilterClick('all')}
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
                onClick={() => handleFilterClick('dietary')}
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
                onClick={() => handleFilterClick('vip')}
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
                onClick={() => handleFilterClick('celebrations')}
              >
                <div className="flex items-center justify-center gap-2">
                  <PartyPopper className="w-4 h-4 text-purple-600" />
                  <span className="text-lg font-medium">{celebrationCount}</span>
                  <span className="text-m text-muted-foreground">Celebrations</span>
                </div>
              </Card>
            </>
          ) : (
            // Front of House Stats
            <>
              <Card 
                className={`p-3 border-2 cursor-pointer transition-all hover:shadow-md ${
                  activeFilter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleFilterClick('all')}
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
                onClick={() => handleFilterClick('dietary')}
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
                onClick={() => handleFilterClick('vip')}
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
                onClick={() => handleFilterClick('celebrations')}
              >
                <div className="flex items-center justify-center gap-2">
                  <PartyPopper className="w-4 h-4 text-purple-600" />
                  <span className="text-lg font-medium">{celebrationCount}</span>
                  <span className="text-m text-muted-foreground">Celebrations</span>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Guest Cards */}
      <div>
        <h2 className="text-3xl font-medium text-foreground mb-3 text-center">
          {isBackOfHouse ? "Kitchen Prep Notes" : "Tonight's Reservations"}
          {activeFilter !== 'all' && (
            <span className="text-xl text-muted-foreground ml-2">
              ({filteredReservations.length} of {reservations.length})
            </span>
          )}
        </h2>
        {activeFilter !== 'all' && (
          <div className="text-center mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter('all')}
              className="text-sm"
            >
              Clear Filter
            </Button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReservations.map((reservation) => (
            <GuestCard 
              key={reservation.id} 
              reservation={reservation} 
              viewMode={viewMode}
            />
          ))}
        </div>
        {filteredReservations.length === 0 && activeFilter !== 'all' && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-lg">
              No reservations match the current filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}