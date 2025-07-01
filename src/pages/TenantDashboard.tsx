"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/src/components/ui/loading-spinner";
import { Header } from "@/src/components/layout/Header";
import { PropertyMatching } from "@/src/components/properties/PropertyMatching";
import { MessageCenter } from "@/src/components/communication/MessageCenter";
import { ProfileManager } from "@/src/components/profile/ProfileManager";
import { useAuth } from "@/src/context/AuthContext";
import { tenantsApi } from "@/src/lib/tenantsApi";
import { optimizationApi } from "@/src/lib/optimizationApi";
import { convertBackendToFrontend } from "@/src/utils/typeConversion";
import {
  Settings,
} from "lucide-react";
import type { ITenant, OptimizationResult, IUser } from "@/src/types";

export default function TenantDashboard() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [tenant, setTenant] = useState<ITenant | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('matches');

  // Get initial tab from URL params
  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam && ['matches', 'preferences', 'messages', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user?._id) {
      loadTenantData();
    }
  }, [user?._id]);

  const loadTenantData = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load tenant profile
      const tenantResponse = await tenantsApi.getProfile(user._id);
      if (tenantResponse.success && tenantResponse.data) {
        const convertedTenant = convertBackendToFrontend.tenant(tenantResponse.data);
        setTenant(convertedTenant);
      }

      // Load optimization results
      const optimizationResponse = await optimizationApi.findMatches(user._id, 10);
      if (optimizationResponse.success && optimizationResponse.data) {
        setOptimizationResult(optimizationResponse.data as OptimizationResult);
      }
    } catch (err) {
      setError('Failed to load tenant data. Please try again.');
      console.error('Error loading tenant data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySelect = (propertyId: string) => {
    // Navigate to property details page
    window.location.href = `/property/${propertyId}`;
  };

  const handleUpdatePreferences = async (preferences: Partial<ITenant['preferences']>) => {
    if (!user?._id) return;
    
    try {
      const response = await tenantsApi.updatePreferences(user._id, {preferences});
      if (response.success && response.data) {
        const convertedTenant = convertBackendToFrontend.tenant(response.data);
        setTenant(convertedTenant);
        // Reload optimization results with new preferences
        await loadTenantData();
      }
    } catch (err) {
      setError('Failed to update preferences. Please try again.');
      console.error('Error updating preferences:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Please log in to access your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="tenant" userName={user.name || 'Tenant'} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || 'Tenant'}!
          </h2>
          <p className="text-gray-600">
            {optimizationResult ? 
              `AI-powered matching found ${optimizationResult.matches.length} properties that match your preferences.` :
              'Set up your preferences to get personalized property recommendations.'
            }
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="matches">Smart Matches</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            {optimizationResult && (
              <PropertyMatching 
                matches={optimizationResult.matches}
                onPropertySelect={handlePropertySelect}
              />
            )}
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Update Your Preferences
                </CardTitle>
                <CardDescription>
                  Adjust your preferences to optimize the linear programming algorithm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tenant && (
                  <>
                    {/* Summary Card */}
                    <div className="mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="font-medium">Budget Range</div>
                          <div>
                            ₦{tenant.preferences.budget.min.toLocaleString()} - ₦{tenant.preferences.budget.max.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Preferred Location</div>
                          <div>{tenant.preferences.preferredLocation}</div>
                        </div>
                        <div>
                          <div className="font-medium">Bedrooms</div>
                          <div>{tenant.preferences.preferredBedrooms}</div>
                        </div>
                        <div>
                          <div className="font-medium">Bathrooms</div>
                          <div>{tenant.preferences.preferredBathrooms}</div>
                        </div>
                      </div>
                      {/* Required Amenities */}
                      <div>
                        <div className="font-medium">Required Amenities</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {tenant.preferences.requiredAmenities.map((amenity) => (
                            <span key={amenity} className="px-2 py-1 bg-gray-100 rounded text-sm">{amenity}</span>
                          ))}
                        </div>
                      </div>
                      {/* Preferred Features */}
                      {tenant.preferences.features && (
                        <div>
                          <div className="font-medium mt-4">Preferred Features</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(tenant.preferences.features)
                              .filter(([_, v]) => v)
                              .map(([feature]) => (
                                <span key={feature} className="px-2 py-1 bg-gray-100 rounded text-sm">{feature}</span>
                              ))}
                          </div>
                        </div>
                      )}
                      {/* Preferred Utilities */}
                      {tenant.preferences.utilities && (
                        <div>
                          <div className="font-medium mt-4">Preferred Utilities</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(tenant.preferences.utilities)
                              .filter(([_, v]) => v)
                              .map(([utility]) => (
                                <span key={utility} className="px-2 py-1 bg-gray-100 rounded text-sm">{utility}</span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Edit Form */}
                    <PreferencesForm 
                      preferences={tenant.preferences}
                      onUpdate={handleUpdatePreferences}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <MessageCenter userId={user._id} userType="tenant" />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileManager />
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

interface PreferencesFormProps {
  preferences: ITenant['preferences'];
  onUpdate: (preferences: Partial<ITenant['preferences']>) => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, onUpdate }) => {
  // Always ensure all keys are present for features/utilities
  function normalizePreferences(prefs: ITenant['preferences']): ITenant['preferences'] {
    return {
      ...prefs,
      features: {
        furnished: prefs.features?.furnished ?? false,
        petFriendly: prefs.features?.petFriendly ?? false,
        parking: prefs.features?.parking ?? false,
        balcony: prefs.features?.balcony ?? false,
      },
      utilities: {
        electricity: prefs.utilities?.electricity ?? false,
        water: prefs.utilities?.water ?? false,
        internet: prefs.utilities?.internet ?? false,
        gas: prefs.utilities?.gas ?? false,
      },
    };
  }

  const [localPreferences, setLocalPreferences] = useState(() => normalizePreferences(preferences));
  const [saving, setSaving] = useState(false);

  // Sync localPreferences with prop changes
  useEffect(() => {
    setLocalPreferences(normalizePreferences(preferences));
  }, [preferences]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(localPreferences);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Range */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Budget Range (₦)</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minBudget">Minimum</Label>
            <Input
              id="minBudget"
              type="number"
              value={localPreferences.budget.min}
              onChange={(e) => setLocalPreferences({
                ...localPreferences,
                budget: { ...localPreferences.budget, min: Number(e.target.value) }
              })}
              placeholder="Minimum budget"
            />
          </div>
          <div>
            <Label htmlFor="maxBudget">Maximum</Label>
            <Input
              id="maxBudget"
              type="number"
              value={localPreferences.budget.max}
              onChange={(e) => setLocalPreferences({
                ...localPreferences,
                budget: { ...localPreferences.budget, max: Number(e.target.value) }
              })}
              placeholder="Maximum budget"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Preferred Location</Label>
        <Input
          id="location"
          value={localPreferences.preferredLocation}
          onChange={(e) => setLocalPreferences({
            ...localPreferences,
            preferredLocation: e.target.value
          })}
          placeholder="e.g., Lekki, Victoria Island"
        />
      </div>

      {/* Bedrooms and Bathrooms */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Preferred Bedrooms</Label>
          <Select
            value={localPreferences.preferredBedrooms.toString()}
            onValueChange={(value) => setLocalPreferences({
              ...localPreferences,
              preferredBedrooms: Number(value)
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Preferred Bathrooms</Label>
          <Select
            value={localPreferences.preferredBathrooms.toString()}
            onValueChange={(value) => setLocalPreferences({
              ...localPreferences,
              preferredBathrooms: Number(value)
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Bathroom' : 'Bathrooms'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Required Amenities */}
      <div>
        <div className="font-medium">Required Amenities</div>
        <div className="flex flex-wrap gap-2 mt-1">
          {localPreferences.requiredAmenities.map((amenity) => (
            <span key={amenity} className="px-2 py-1 bg-gray-100 rounded text-sm">{amenity}</span>
          ))}
        </div>
      </div>

      {/* Preferred Features */}
      <div>
        <div className="font-medium mt-4">Preferred Features</div>
        <div className="flex flex-wrap gap-2 mt-1">
          {Object.entries(localPreferences.features || {})
            .filter(([_, v]) => v)
            .map(([feature]) => (
              <span key={feature} className="px-2 py-1 bg-gray-100 rounded text-sm">{feature}</span>
            ))}
        </div>
      </div>

      {/* Preferred Utilities */}
      <div>
        <div className="font-medium mt-4">Preferred Utilities</div>
        <div className="flex flex-wrap gap-2 mt-1">
          {Object.entries(localPreferences.utilities || {})
            .filter(([_, v]) => v)
            .map(([utility]) => (
              <span key={utility} className="px-2 py-1 bg-gray-100 rounded text-sm">{utility}</span>
            ))}
        </div>
      </div>

      {/* Max Commute */}
      <div className="space-y-2">
        <Label htmlFor="maxCommute">Maximum Commute Time (minutes)</Label>
        <Input
          id="maxCommute"
          type="number"
          value={localPreferences.maxCommute || ''}
          onChange={(e) => setLocalPreferences({
            ...localPreferences,
            maxCommute: e.target.value ? Number(e.target.value) : undefined
          })}
          placeholder="e.g., 30"
        />
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        {saving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
        Update Preferences
      </Button>
    </div>
  );
};
