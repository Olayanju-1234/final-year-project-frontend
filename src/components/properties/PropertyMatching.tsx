import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Star, MapPin, Home, Users, Bath, Car, Wifi } from 'lucide-react';
import { optimizationApi } from '@/src/lib/optimizationApi';
import { tenantsApi } from '@/src/lib/tenantsApi';
import { propertiesApi } from '@/src/lib/propertiesApi';
import { convertBackendToFrontend } from '@/src/utils/typeConversion';
import type { OptimizationResult, PropertyMatch, ITenant } from '@/src/types';

interface PropertyMatchingProps {
  tenantId: string;
  onPropertySelect?: (propertyId: string) => void;
}

export const PropertyMatching: React.FC<PropertyMatchingProps> = ({
  tenantId,
  onPropertySelect,
}) => {
  const [tenant, setTenant] = useState<ITenant | null>(null);
  const [matches, setMatches] = useState<PropertyMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationStats, setOptimizationStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('matches');

  useEffect(() => {
    loadTenantAndMatches();
    loadOptimizationStats();
  }, [tenantId]);

  const loadTenantAndMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load tenant profile
      const tenantResponse = await tenantsApi.getProfile(tenantId);
      if (tenantResponse.success && tenantResponse.data) {
        const convertedTenant = convertBackendToFrontend.tenant(tenantResponse.data);
        setTenant(convertedTenant);
      }

      // Load optimized matches
      const matchesResponse = await optimizationApi.findMatches(tenantId, 10);
      if (matchesResponse.success && matchesResponse.data) {
        const convertedResult = convertBackendToFrontend.optimizationResult(matchesResponse.data);
        setMatches(convertedResult.matches);
      }
    } catch (err) {
      setError('Failed to load matches. Please try again.');
      console.error('Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOptimizationStats = async () => {
    try {
      const statsResponse = await optimizationApi.getOptimizationStats();
      if (statsResponse.success) {
        setOptimizationStats(statsResponse.data);
      }
    } catch (err) {
      console.error('Error loading optimization stats:', err);
    }
  };

  const runCustomOptimization = async () => {
    if (!tenant) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const constraints = {
        budget: tenant.preferences.budget,
        location: tenant.preferences.preferredLocation,
        amenities: tenant.preferences.requiredAmenities,
        bedrooms: tenant.preferences.preferredBedrooms,
        bathrooms: tenant.preferences.preferredBathrooms,
        maxCommute: tenant.preferences.maxCommute,
      };

      const result = await optimizationApi.runOptimization(constraints, {}, 10);
      if (result.success && result.data) {
        const convertedResult = convertBackendToFrontend.optimizationResult(result.data);
        setMatches(convertedResult.matches);
      }
    } catch (err) {
      setError('Failed to run optimization. Please try again.');
      console.error('Error running optimization:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading && !tenant) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading matches...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Smart Property Matching
          </CardTitle>
          <CardDescription>
            AI-powered matching using linear programming optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="matches">Matches ({matches.length})</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Top Matches</h3>
                <Button 
                  onClick={runCustomOptimization} 
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Refresh Matches
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Finding matches...</span>
                </div>
              ) : matches.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No matches found. Try adjusting your preferences or expanding your search criteria.
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

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{match.explanation.find(e => e.includes('location')) || 'Location details'}</span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Home className="w-4 h-4" />
                              <span>{match.explanation.find(e => e.includes('bedroom')) || 'Bedroom info'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="w-4 h-4" />
                              <span>{match.explanation.find(e => e.includes('bathroom')) || 'Bathroom info'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Budget: {match.explanation.find(e => e.includes('budget')) || 'Budget info'}</span>
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
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              {tenant ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Budget Range</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>₦{tenant.preferences.budget.min.toLocaleString()}</span>
                            <span>₦{tenant.preferences.budget.max.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={((tenant.preferences.budget.min / tenant.preferences.budget.max) * 100)} 
                            className="w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Location</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{tenant.preferences.preferredLocation}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Required Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {tenant.preferences.requiredAmenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {getAmenityIcon(amenity)}
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Bedrooms</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          <span>{tenant.preferences.preferredBedrooms} {tenant.preferences.preferredBedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Bathrooms</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Bath className="w-4 h-4 text-muted-foreground" />
                          <span>{tenant.preferences.preferredBathrooms} {tenant.preferences.preferredBathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>Tenant preferences not available.</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              {optimizationStats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Total Optimizations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{optimizationStats.totalOptimizations}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Avg Execution Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{optimizationStats.averageExecutionTime.toFixed(2)}ms</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Avg Match Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{optimizationStats.averageMatchScore.toFixed(1)}%</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Popular Amenities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {optimizationStats.mostRequestedAmenities?.map((amenity: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="capitalize">{amenity.amenity}</span>
                            <Badge variant="outline">{amenity.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Popular Locations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {optimizationStats.popularLocations?.map((location: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>{location.location}</span>
                            <Badge variant="outline">{location.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>Optimization statistics not available.</AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 