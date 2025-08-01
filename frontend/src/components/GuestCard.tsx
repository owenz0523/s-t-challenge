import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Star, 
  Users, 
  Clock, 
  UtensilsCrossed, 
  PartyPopper, 
  Accessibility,
  MessageCircle,
  History,
  Utensils,
  AlertTriangle,
  ChefHat
} from 'lucide-react';

export type ViewMode = 'front-of-house' | 'back-of-house';

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
  kitchenNotes?: string;
}

interface GuestCardProps {
  reservation: Reservation;
  viewMode: ViewMode;
}

export function GuestCard({ reservation, viewMode }: GuestCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    guestName,
    partySize,
    time,
    isVip,
    dietaryRestrictions,
    specialOccasion,
    accessibility,
    guestHistory,
    conversationStarters,
    specialRequests,
    kitchenNotes
  } = reservation;

  const isBackOfHouse = viewMode === 'back-of-house';

  // Determine priority level for card styling
  const hasAlerts = dietaryRestrictions.some(r => r.toLowerCase().includes('allergy') || r.toLowerCase().includes('severe')) || 
                   accessibility || 
                   specialOccasion === 'Proposal';

  const hasCriticalAllergy = dietaryRestrictions.some(r => 
    r.toLowerCase().includes('allergy') && r.toLowerCase().includes('severe')
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Card className={`border-2 transition-all duration-200 cursor-pointer hover:shadow-md hover:bg-muted/50 ${
          hasAlerts ? (hasCriticalAllergy && isBackOfHouse ? 'border-red-500 shadow-lg bg-red-50' : 'border-red-200 shadow-md') : 'border-gray-300'
        }`}>
          <div className="p-4 text-center">
            <div className="flex flex-col items-center mb-3">
              <div className="w-full">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground text-2xl">
                    {isBackOfHouse ? `Table - ${guestName}` : guestName}
                  </h3>
                  {hasAlerts && (
                    <AlertTriangle className={`w-4 h-4 ${
                      hasCriticalAllergy && isBackOfHouse ? 'text-red-600' : 'text-red-500'
                    }`} />
                  )}
                  {hasCriticalAllergy && isBackOfHouse && (
                    <Badge variant="destructive" className="bg-red-600 text-white">
                      CRITICAL
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{partySize} {isBackOfHouse ? 'covers' : 'guests'}</span>
                  </div>
                </div>

                {/* Quick summary */}
                <div className="text-sm text-muted-foreground line-clamp-2 text-center">
                  {isBackOfHouse ? (kitchenNotes || "No special kitchen requirements") : (specialRequests || guestHistory)}
                </div>
              </div>
            </div>

            {/* Visual Flags/Badges */}
            <div className="flex flex-wrap gap-1.5 justify-center">
              {isBackOfHouse ? (
                // Back of House Badges
                <>
                  {dietaryRestrictions.map((restriction, index) => (
                    <Badge 
                      key={index} 
                      variant="destructive" 
                      className={restriction.toLowerCase().includes('allergy') || restriction.toLowerCase().includes('severe') 
                        ? "bg-red-600 text-white border-red-600" 
                        : "bg-orange-100 text-orange-800 border-orange-200"
                      }
                    >
                      <UtensilsCrossed className="w-3 h-3 mr-1" />
                      {restriction}
                    </Badge>
                  ))}
                  
                  {specialOccasion && (
                    <Badge variant="secondary" className="text-purple-700 bg-purple-50 border-purple-200">
                      <ChefHat className="w-3 h-3 mr-1" />
                      Special prep
                    </Badge>
                  )}
                  
                  {partySize >= 6 && (
                    <Badge variant="secondary" className="text-blue-700 bg-blue-50 border-blue-200">
                      <Users className="w-3 h-3 mr-1" />
                      Large party
                    </Badge>
                  )}
                </>
              ) : (
                // Front of House Badges
                <>
                  {isVip && (
                    <Badge variant="secondary" className="text-yellow-700 bg-yellow-50 border-yellow-200">
                      <Star className="w-3 h-3 mr-1" />
                      VIP
                    </Badge>
                  )}
                  
                  {dietaryRestrictions.map((restriction, index) => (
                    <Badge 
                      key={index} 
                      variant="destructive" 
                      className={restriction.toLowerCase().includes('allergy') || restriction.toLowerCase().includes('severe') 
                        ? "bg-red-100 text-red-800 border-red-200" 
                        : "bg-orange-50 text-orange-700 border-orange-200"
                      }
                    >
                      <UtensilsCrossed className="w-3 h-3 mr-1" />
                      {restriction}
                    </Badge>
                  ))}
                  
                  {specialOccasion && (
                    <Badge variant="secondary" className="text-purple-700 bg-purple-50 border-purple-200">
                      <PartyPopper className="w-3 h-3 mr-1" />
                      {specialOccasion}
                    </Badge>
                  )}
                  
                  {accessibility && (
                    <Badge variant="secondary" className="text-blue-700 bg-blue-50 border-blue-200">
                      <Accessibility className="w-3 h-3 mr-1" />
                      Accessibility
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      </DialogTrigger>

      {/* Modal Content */}
      <DialogContent className="max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isBackOfHouse ? `Kitchen Notes - ${guestName}` : guestName}
            {hasAlerts && (
              <AlertTriangle className={`w-4 h-4 ${
                hasCriticalAllergy && isBackOfHouse ? 'text-red-600' : 'text-red-500'
              }`} />
            )}
            {hasCriticalAllergy && isBackOfHouse && (
              <Badge variant="destructive" className="bg-red-600 text-white">
                CRITICAL
              </Badge>
            )}
          </DialogTitle>
          
          {/* Basic Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{partySize} {isBackOfHouse ? 'covers' : 'guests'}</span>
            </div>
          </div>
        </DialogHeader>

        {/* Detailed Content */}
        <div className="space-y-4 pt-4">
          {isBackOfHouse ? (
            // Back of House Content
            <>
              {/* Kitchen Notes */}
              {kitchenNotes && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ChefHat className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Kitchen Preparation Notes</span>
                  </div>
                  <p className={`text-sm pl-6 ${
                    hasCriticalAllergy ? 'text-red-700 font-medium' : 'text-muted-foreground'
                  }`}>
                    {kitchenNotes}
                  </p>
                </div>
              )}

              {/* Dietary Requirements - Prominent in kitchen view */}
              {dietaryRestrictions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UtensilsCrossed className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-sm">Dietary Requirements</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {dietaryRestrictions.map((restriction, index) => (
                      <div 
                        key={index} 
                        className={`text-sm ${
                          restriction.toLowerCase().includes('allergy') || restriction.toLowerCase().includes('severe')
                            ? 'text-red-600 font-medium' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        • {restriction}
                        {(restriction.toLowerCase().includes('allergy') || restriction.toLowerCase().includes('severe')) && 
                          <span className="text-red-600 ml-1 font-medium">⚠️ ALERT KITCHEN STAFF</span>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Requests from Kitchen Perspective */}
              {specialRequests && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-sm">Service Coordination</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{specialRequests}</p>
                </div>
              )}
            </>
          ) : (
            // Front of House Content
            <>
              {/* Guest History */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Guest History</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{guestHistory}</p>
              </div>

              {/* Conversation Starters */}
              {conversationStarters.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">Conversation Topics</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {conversationStarters.map((topic, index) => (
                      <div key={index} className="text-sm text-muted-foreground">• {topic}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {specialRequests && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-sm">Special Requests</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{specialRequests}</p>
                </div>
              )}

              {/* Dietary Details */}
              {dietaryRestrictions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UtensilsCrossed className="w-4 h-4 text-red-500" />
                    <span className="font-medium text-sm">Dietary Requirements</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {dietaryRestrictions.map((restriction, index) => (
                      <div 
                        key={index} 
                        className={`text-sm ${
                          restriction.toLowerCase().includes('allergy') || restriction.toLowerCase().includes('severe')
                            ? 'text-red-600 font-medium' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        • {restriction}
                        {(restriction.toLowerCase().includes('allergy') || restriction.toLowerCase().includes('severe')) && 
                          <span className="text-red-600 ml-1 font-medium">⚠️ CRITICAL</span>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accessibility Details */}
              {accessibility && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Accessibility className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-sm">Accessibility Requirements</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{accessibility}</p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}