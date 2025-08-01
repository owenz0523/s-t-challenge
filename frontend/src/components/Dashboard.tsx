import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { GuestCard } from './GuestCard';
import { Users, Calendar, Star, UtensilsCrossed, PartyPopper, ChefHat, UserCheck } from 'lucide-react';

export type ViewMode = 'front-of-house' | 'back-of-house';

interface DashboardProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

// Mock data for reservations
const mockReservations = [
  {
    id: 1,
    guestName: "Sarah Thompson",
    partySize: 4,
    time: "6:00 PM",
    timeSort: 1800,
    isVip: true,
    dietaryRestrictions: ["Gluten-free", "Dairy-free"],
    specialOccasion: "Anniversary",
    accessibility: null,
    guestHistory: "Regular customer since 2019. Prefers window tables. Loves the salmon special.",
    favoriteItems: ["Pan-seared Salmon", "Caesar Salad", "Chocolate Tart"],
    conversationStarters: ["Travel - recently returned from Italy", "Art collector"],
    specialRequests: "Surprise anniversary dessert, champagne service",
    lastVisit: "December 15, 2024",
    kitchenNotes: "Gluten-free prep area required. Use dairy-free butter for all dishes. Anniversary dessert - prepare chocolate tart with special presentation."
  },
  {
    id: 2,
    guestName: "Michael Chen",
    partySize: 2,
    time: "6:30 PM",
    timeSort: 1830,
    isVip: false,
    dietaryRestrictions: ["Vegetarian"],
    specialOccasion: null,
    accessibility: "Wheelchair access required",
    guestHistory: "Second visit. First-time visitor was impressed with service.",
    favoriteItems: ["Mushroom Risotto", "Burrata Appetizer"],
    conversationStarters: ["Tech entrepreneur", "Marathon runner"],
    specialRequests: "Table near accessible restroom",
    lastVisit: "January 10, 2025",
    kitchenNotes: "Vegetarian prep only - no cross-contamination with meat products. Previously enjoyed mushroom risotto - consider recommending again."
  },
  {
    id: 3,
    guestName: "Emma Rodriguez",
    partySize: 6,
    time: "7:00 PM",
    timeSort: 1900,
    isVip: true,
    dietaryRestrictions: ["Nut allergy - severe"],
    specialOccasion: "Birthday",
    accessibility: null,
    guestHistory: "VIP member for 3 years. Business dinners monthly. Very social.",
    favoriteItems: ["Wagyu Steak", "Lobster Bisque", "Wine pairings"],
    conversationStarters: ["Real estate executive", "Wine enthusiast", "Has twin daughters"],
    specialRequests: "Birthday cake with candles, no nuts in any dishes",
    lastVisit: "January 20, 2025",
    kitchenNotes: "⚠️ SEVERE NUT ALLERGY - Clean all prep surfaces, use dedicated utensils, check all ingredients. Birthday cake must be nut-free. Alert all kitchen staff."
  },
  {
    id: 4,
    guestName: "David Park",
    partySize: 2,
    time: "7:15 PM",
    timeSort: 1915,
    isVip: false,
    dietaryRestrictions: [],
    specialOccasion: "Proposal",
    accessibility: null,
    guestHistory: "First-time guest. Called ahead about proposal plans.",
    favoriteItems: [],
    conversationStarters: ["Nervous about proposal", "Software developer"],
    specialRequests: "Quiet corner table, champagne ready, photographer arranged for 8:30 PM",
    lastVisit: null,
    kitchenNotes: "Special romantic presentation for dessert course. Have champagne and special dessert ready for 8:30 PM timing. Coordinate with service team."
  },
  {
    id: 5,
    guestName: "Lisa Wang",
    partySize: 8,
    time: "8:00 PM",
    timeSort: 2000,
    isVip: true,
    dietaryRestrictions: ["Pescatarian", "No shellfish"],
    specialOccasion: null,
    accessibility: null,
    guestHistory: "Corporate account - monthly team dinners. Very punctual.",
    favoriteItems: ["Fish of the day", "Seasonal vegetables", "Craft cocktails"],
    conversationStarters: ["Marketing director", "Corporate team building"],
    specialRequests: "Separate checks for 8 people, presentation setup available",
    lastVisit: "December 28, 2024",
    kitchenNotes: "Pescatarian - fish and vegetables only, NO SHELLFISH. Large party - coordinate timing for 8 covers. Prep extra fish portions."
  }
];

export function Dashboard({ viewMode, onViewModeChange }: DashboardProps) {
  const totalReservations = mockReservations.length;
  const vipCount = mockReservations.filter(r => r.isVip).length;
  const dietaryCount = mockReservations.filter(r => r.dietaryRestrictions.length > 0).length;
  const celebrationCount = mockReservations.filter(r => r.specialOccasion).length;
  const accessibilityCount = mockReservations.filter(r => r.accessibility).length;
  const severeAllergyCount = mockReservations.filter(r => 
    r.dietaryRestrictions.some(restriction => 
      restriction.toLowerCase().includes('allergy') && restriction.toLowerCase().includes('severe')
    )
  ).length;

  const sortedReservations = [...mockReservations].sort((a, b) => a.timeSort - b.timeSort);

  const isBackOfHouse = viewMode === 'back-of-house';

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Morning Huddle</h1>
            <p className="text-muted-foreground">Thursday, July 31, 2025</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-medium text-foreground">{totalReservations}</div>
            <div className="text-sm text-muted-foreground">Reservations</div>
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === 'front-of-house' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('front-of-house')}
            className="flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Front of House
          </Button>
          <Button
            variant={viewMode === 'back-of-house' ? 'default' : 'outline'}
            onClick={() => onViewModeChange('back-of-house')}
            className="flex items-center gap-2"
          >
            <ChefHat className="w-4 h-4" />
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
                  <Star className="w-4 h-4 text-yellow-600" />
                  <div>
                    <div className="text-lg font-medium">{vipCount}</div>
                    <div className="text-xs text-muted-foreground">VIP Guests</div>
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
                  <PartyPopper className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-lg font-medium">{celebrationCount}</div>
                    <div className="text-xs text-muted-foreground">Celebrations</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-lg font-medium">{accessibilityCount}</div>
                    <div className="text-xs text-muted-foreground">Accessibility</div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Guest Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium text-foreground mb-3">
          {isBackOfHouse ? "Kitchen Prep Notes" : "Tonight's Reservations"}
        </h2>
        {sortedReservations.map((reservation) => (
          <GuestCard 
            key={reservation.id} 
            reservation={reservation} 
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}