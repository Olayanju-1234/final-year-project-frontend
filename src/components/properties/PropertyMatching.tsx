import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Star, MapPin, Home, Bath, Wifi, Car } from 'lucide-react';
import type { PropertyMatch } from '@/src/types';

interface PropertyMatchingProps {
  matches: PropertyMatch[];
  onPropertySelect?: (propertyId: string) => void;
}

export const PropertyMatching: React.FC<PropertyMatchingProps> = ({
  matches,
  onPropertySelect,
}) => {
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="w-4 h-4" />;
    if (amenityLower.includes('parking')) return <Car className="w-4 h-4" />;
    if (amenityLower.includes('security')) return <Home className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Your Top Property Matches
        </CardTitle>
        <CardDescription>
          Based on your preferences, here are the best properties we found for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <Alert>
            <AlertDescription>
              No matches found at the moment. You can try adjusting your preferences to see more results.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-4">
            {matches.map((match, index) => (
              <Card key={match.propertyId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <Badge className={getMatchScoreColor(match.matchScore)}>
                        {match.matchScore.toFixed(0)}% Match
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onPropertySelect?.(match.propertyId)}
                    >
                      View Details
                    </Button>
                  </div>

                  {/* Show reason if present */}
                  {match.reason && (
                    <div className="mb-2 text-sm text-blue-700 font-medium">
                      Reason: {match.reason}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{match.explanation.find(e => e.includes('location'))?.split(': ')[1] || 'Location details'}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        <span>{match.explanation.find(e => e.includes('bedroom'))?.split(': ')[1] || 'Bedroom info'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{match.explanation.find(e => e.includes('bathroom'))?.split(': ')[1] || 'Bathroom info'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{match.explanation.find(e => e.includes('budget')) || 'Budget info'}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {match.matchDetails.amenityScore > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Wifi className="w-3 h-3 mr-1" />
                          Amenities: {match.matchDetails.amenityScore.toFixed(0)}%
                        </Badge>
                      )}
                      {match.matchDetails.locationScore > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          Location: {match.matchDetails.locationScore.toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 