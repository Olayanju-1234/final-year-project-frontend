"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { tenantsApi } from "@/src/lib/tenantsApi";
import { useAuth } from "@/src/context/AuthContext";
import { Wifi, Car, Shield, Zap, Droplets } from "lucide-react";
import type { ITenant } from "@/src/types";
import { Skeleton } from "@/components/ui/skeleton";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesSaved: () => void;
  preferences?: ITenant["preferences"];
}

export function PreferencesModal({
  isOpen,
  onClose,
  onPreferencesSaved,
  preferences,
}: PreferencesModalProps) {
  const [budget, setBudget] = useState([500000, 1000000]);
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("2");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Add state for features and utilities
  const [features, setFeatures] = useState({
    furnished: false,
    petFriendly: false,
    parking: false,
    balcony: false,
  });
  const [utilities, setUtilities] = useState({
    electricity: true,
    water: true,
    internet: false,
    gas: false,
  });

  const amenitiesList = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "security", label: "Security", icon: Shield },
    { id: "generator", label: "Generator", icon: Zap },
    { id: "water", label: "Water Supply", icon: Droplets },
  ];

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities((prev) => [...prev, amenityId]);
    } else {
      setSelectedAmenities((prev) => prev.filter((id) => id !== amenityId));
    }
  };

  // Handlers for features and utilities
  const handleFeatureChange = (
    feature: keyof typeof features,
    checked: boolean
  ) => {
    setFeatures((prev) => ({ ...prev, [feature]: checked }));
  };
  const handleUtilityChange = (
    utility: keyof typeof utilities,
    checked: boolean
  ) => {
    setUtilities((prev) => ({ ...prev, [utility]: checked }));
  };

  useEffect(() => {
    if (preferences && isOpen) {
      setBudget([preferences.budget.min, preferences.budget.max]);
      setLocation(preferences.preferredLocation);
      setBedrooms(preferences.preferredBedrooms.toString());
      setBathrooms(preferences.preferredBathrooms.toString());
      setSelectedAmenities(preferences.requiredAmenities);
      setFeatures(
        preferences.features || {
          furnished: false,
          petFriendly: false,
          parking: false,
          balcony: false,
        }
      );
      setUtilities(
        preferences.utilities || {
          electricity: false,
          water: false,
          internet: false,
          gas: false,
        }
      );
    }
  }, [preferences, isOpen]);

  const handleSavePreferences = async () => {
    // Use user._id or user.tenantId (whichever is available)
    const tenantId = user?.tenantId || user?._id;

    // Robust validation
    if (!tenantId) {
      toast({
        title: "Missing Information",
        description: "User ID is missing. Please log in again.",
        variant: "destructive",
      });
      return;
    }
    if (!location || location.trim() === "") {
      toast({
        title: "Missing Information",
        description: "Preferred location is required.",
        variant: "destructive",
      });
      return;
    }
    if (
      !budget ||
      !Array.isArray(budget) ||
      budget.length !== 2 ||
      isNaN(budget[0]) ||
      isNaN(budget[1])
    ) {
      toast({
        title: "Missing Information",
        description: "Budget range is required.",
        variant: "destructive",
      });
      return;
    }
    if (!bedrooms || isNaN(Number(bedrooms))) {
      toast({
        title: "Missing Information",
        description: "Preferred bedrooms is required.",
        variant: "destructive",
      });
      return;
    }
    if (!bathrooms || isNaN(Number(bathrooms))) {
      toast({
        title: "Missing Information",
        description: "Preferred bathrooms is required.",
        variant: "destructive",
      });
      return;
    }
    if (
      !selectedAmenities ||
      !Array.isArray(selectedAmenities) ||
      selectedAmenities.length === 0
    ) {
      toast({
        title: "Missing Information",
        description: "At least one required amenity must be selected.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const preferences = {
        budget: {
          min: Number(budget[0]),
          max: Number(budget[1]),
        },
        preferredLocation: location,
        requiredAmenities: selectedAmenities,
        preferredBedrooms: Number(bedrooms),
        preferredBathrooms: Number(bathrooms),
        features,
        utilities,
      };
      console.log("Submitting preferences payload:", preferences);

      const response = await tenantsApi.updatePreferences(tenantId, {
        preferences,
      });

      if (response.success) {
        toast({
          title: "Preferences Saved!",
          description: "Your preferences have been saved successfully.",
          variant: "default",
        });
        onPreferencesSaved();
        onClose();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to save preferences",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Welcome to RentMatch! 🏠</DialogTitle>
          <DialogDescription>
            Let's set up your preferences to help us find the perfect property
            for you. You can always update these later in your dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="text-red-500 mb-2">{error}</span>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <>
              <div>
                <Label className="text-base font-medium">
                  Budget Range (Annual Rent)
                </Label>
                <div className="mt-2">
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    max={3000000}
                    min={200000}
                    step={50000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>₦200k</span>
                    <span className="font-medium">
                      ₦{budget[0].toLocaleString()} - ₦{budget[1].toLocaleString()}
                    </span>
                    <span>₦3M</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">
                  Preferred Location *
                </Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your preferred location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Victoria Island">Victoria Island</SelectItem>
                    <SelectItem value="Lekki">Lekki</SelectItem>
                    <SelectItem value="Ikeja">Ikeja</SelectItem>
                    <SelectItem value="Surulere">Surulere</SelectItem>
                    <SelectItem value="Yaba">Yaba</SelectItem>
                    <SelectItem value="Ikorodu">Ikorodu</SelectItem>
                    <SelectItem value="Oshodi">Oshodi</SelectItem>
                    <SelectItem value="Alimosho">Alimosho</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium">
                    Preferred Bedrooms
                  </Label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-base font-medium">
                    Preferred Bathrooms
                  </Label>
                  <Select value={bathrooms} onValueChange={setBathrooms}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bathroom</SelectItem>
                      <SelectItem value="2">2 Bathrooms</SelectItem>
                      <SelectItem value="3">3 Bathrooms</SelectItem>
                      <SelectItem value="4">4+ Bathrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">
                  Required Amenities
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={selectedAmenities.includes(amenity.id)}
                        onCheckedChange={(checked) =>
                          handleAmenityChange(amenity.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={amenity.id}
                        className="flex items-center cursor-pointer"
                      >
                        <amenity.icon className="h-4 w-4 mr-2" />
                        {amenity.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <Label className="text-base font-medium mb-4 block">Features</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: "furnished", label: "Furnished" },
                    { id: "petFriendly", label: "Pet Friendly" },
                    { id: "parking", label: "Parking" },
                    { id: "balcony", label: "Balcony" },
                  ].map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature.id}
                        checked={features[feature.id as keyof typeof features]}
                        onCheckedChange={(checked) =>
                          handleFeatureChange(
                            feature.id as keyof typeof features,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={feature.id} className="cursor-pointer">
                        {feature.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Utilities */}
              <div>
                <Label className="text-base font-medium mb-4 block">
                  Utilities Included
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: "electricity", label: "Electricity" },
                    { id: "water", label: "Water" },
                    { id: "internet", label: "Internet" },
                    { id: "gas", label: "Gas" },
                  ].map((utility) => (
                    <div key={utility.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={utility.id}
                        checked={utilities[utility.id as keyof typeof utilities]}
                        onCheckedChange={(checked) =>
                          handleUtilityChange(
                            utility.id as keyof typeof utilities,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={utility.id} className="cursor-pointer">
                        {utility.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <Button
                  className="flex-1"
                  onClick={handleSavePreferences}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : null}
                  Save Preferences & Find Properties
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Skip for Now
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
