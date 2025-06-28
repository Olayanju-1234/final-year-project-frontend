"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { PropertyCard } from "@/src/components/properties/PropertyCard";
import { EmptyState } from "@/src/components/common/EmptyState";
import {
  Search,
  Star,
  Settings,
  Calculator,
  TrendingUp,
  Wifi,
  Car,
  Shield,
  Zap,
  Droplets,
} from "lucide-react";

// Define types locally since they're not exported from the API
interface Property {
  id: string;
  title: string;
  location: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  description: string;
  images: string[];
  landlordId: string;
  landlordName: string;
  landlordContact: { phone: string; email: string };
  status: string;
  createdAt: string;
  updatedAt: string;
  size?: number;
}

interface PropertyMatch {
  propertyId: string;
  tenantId: string;
  matchScore: number;
  matchDetails: {
    budgetScore: number;
    locationScore: number;
    amenityScore: number;
    sizeScore: number;
  };
  explanation: string[];
}

// Mock data for demo - TODO: Replace with real API calls
const mockMatches: (Property & { match: PropertyMatch })[] = [
  {
    id: "1",
    title: "Modern 2-Bedroom Apartment",
    location: "Victoria Island, Lagos",
    rent: 850000,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["WiFi", "Parking", "Security", "Generator"],
    description: "Spacious apartment with modern finishes in prime location",
    images: ["/placeholder.svg?height=200&width=300"],
    landlordId: "landlord1",
    landlordName: "Adebayo Properties",
    landlordContact: {
      phone: "+234 801 234 5678",
      email: "contact@adebayo.com",
    },
    status: "available",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    match: {
      propertyId: "1",
      tenantId: "tenant1",
      matchScore: 92,
      matchDetails: {
        budgetScore: 95,
        locationScore: 90,
        amenityScore: 88,
        sizeScore: 85,
      },
      explanation: [
        "Perfect budget match (₦850k vs ₦900k max)",
        "Preferred location: Victoria Island",
        "All requested amenities available",
      ],
    },
  },
  {
    id: "2",
    title: "Cozy 1-Bedroom Studio",
    location: "Ikeja GRA, Lagos",
    rent: 450000,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Security", "Generator"],
    description: "Perfect for young professionals",
    images: ["/placeholder.svg?height=200&width=300"],
    landlordId: "landlord2",
    landlordName: "Urban Living",
    landlordContact: {
      phone: "+234 802 345 6789",
      email: "info@urbanliving.com",
    },
    status: "available",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
    match: {
      propertyId: "2",
      tenantId: "tenant1",
      matchScore: 85,
      matchDetails: {
        budgetScore: 100,
        locationScore: 75,
        amenityScore: 80,
        sizeScore: 70,
      },
      explanation: [
        "Well within budget (₦450k vs ₦900k max)",
        "Good location accessibility",
        "Essential amenities covered",
      ],
    },
  },
];

export default function TenantDashboard() {
  const [budget, setBudget] = useState([900000]);
  const [selectedAmenities, setSelectedAmenities] = useState([
    "WiFi",
    "Parking",
    "Security",
  ]);
  const [location, setLocation] = useState("Victoria Island");
  const [isOptimizing, setIsOptimizing] = useState(false);

  // TODO: Replace with real API calls
  const [matches, setMatches] = useState(mockMatches);
  const [optimizationStats, setOptimizationStats] = useState({
    executionTime: 0.8,
    constraintsSatisfied: 4,
    objectiveValue: 0.89,
  });

  const amenitiesList = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "security", label: "Security", icon: Shield },
    { id: "generator", label: "Generator", icon: Zap },
    { id: "water", label: "Water Supply", icon: Droplets },
  ];

  // TODO: Connect to your backend optimization endpoint
  const runOptimization = async () => {
    setIsOptimizing(true);

    try {
      // Simulate API call - replace with real endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Replace with actual API call
      // const response = await optimizationApi.runOptimization({
      //   budget: { min: 0, max: budget[0] },
      //   location,
      //   amenities: selectedAmenities,
      //   bedrooms: 2,
      //   bathrooms: 1
      // })

      setOptimizationStats({
        executionTime: Math.random() * 2 + 0.5,
        constraintsSatisfied: 4,
        objectiveValue: 0.85 + Math.random() * 0.1,
      });
    } catch (error) {
      console.error("Optimization failed:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleViewProperty = (propertyId: string) => {
    // TODO: Navigate to property details page
    console.log("View property:", propertyId);
  };

  const handleContactLandlord = (propertyId: string) => {
    // TODO: Open contact form or navigate to contact page
    console.log("Contact landlord for property:", propertyId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="tenant" userName="John Doe" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, John!
          </h2>
          <p className="text-gray-600">
            Linear programming optimization found {matches.length} properties
            that match your preferences
          </p>
        </div>

        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="matches">My Matches</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="optimization">Algorithm Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Matches
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {matches.length}
                      </p>
                    </div>
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Best Match
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {Math.max(...matches.map((m) => m.match.matchScore))}%
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Avg. Match Score
                      </p>
                      <p className="text-3xl font-bold text-purple-600">
                        {Math.round(
                          matches.reduce(
                            (acc, m) => acc + m.match.matchScore,
                            0
                          ) / matches.length
                        )}
                        %
                      </p>
                    </div>
                    <Calculator className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Property Matches */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Optimized Matches
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runOptimization}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Re-run Optimization
                    </>
                  )}
                </Button>
              </div>

              {matches.length > 0 ? (
                matches.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    match={property.match}
                    onView={handleViewProperty}
                    onContact={handleContactLandlord}
                    showMatchScore={true}
                  />
                ))
              ) : (
                <EmptyState
                  icon={<Search className="h-12 w-12 text-gray-400" />}
                  title="No matches found"
                  description="Try adjusting your preferences to find more properties"
                  actionLabel="Update Preferences"
                  onAction={() => {}}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Update Your Preferences
                </CardTitle>
                <CardDescription>
                  Adjust your preferences to optimize the linear programming
                  algorithm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">
                    Budget Range (Annual)
                  </Label>
                  <div className="mt-2">
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      max={2000000}
                      min={200000}
                      step={50000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>₦200k</span>
                      <span className="font-medium">
                        ₦{budget[0].toLocaleString()}
                      </span>
                      <span>₦2M</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">
                    Preferred Location
                  </Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Victoria Island">
                        Victoria Island
                      </SelectItem>
                      <SelectItem value="Lekki">Lekki</SelectItem>
                      <SelectItem value="Ikeja">Ikeja</SelectItem>
                      <SelectItem value="Surulere">Surulere</SelectItem>
                      <SelectItem value="Yaba">Yaba</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium mb-4 block">
                    Required Amenities
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenitiesList.map((amenity) => (
                      <div
                        key={amenity.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={amenity.id}
                          checked={selectedAmenities.includes(amenity.label)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAmenities([
                                ...selectedAmenities,
                                amenity.label,
                              ]);
                            } else {
                              setSelectedAmenities(
                                selectedAmenities.filter(
                                  (a) => a !== amenity.label
                                )
                              );
                            }
                          }}
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

                <Button
                  className="w-full"
                  onClick={runOptimization}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Running Optimization...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Update Preferences & Re-optimize
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Linear Programming Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Algorithm Type</span>
                    <span className="font-semibold">Linear Programming</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Execution Time</span>
                    <span className="font-semibold">
                      {optimizationStats.executionTime.toFixed(2)}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Constraints Satisfied</span>
                    <span className="font-semibold">
                      {optimizationStats.constraintsSatisfied}/4
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Objective Value</span>
                    <span className="font-semibold">
                      {optimizationStats.objectiveValue.toFixed(3)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Optimization Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Budget Constraint
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        Satisfied
                      </span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Location Preference
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        Satisfied
                      </span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Amenity Requirements
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        Satisfied
                      </span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Availability Constraint
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        Satisfied
                      </span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Algorithm Performance</CardTitle>
                <CardDescription>
                  Linear programming optimization model performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {optimizationStats.objectiveValue.toFixed(1)}
                  </div>
                  <p className="text-gray-600 mb-4">
                    Overall Optimization Score
                  </p>
                  <p className="text-sm text-gray-500">
                    Based on weighted satisfaction of all constraints and
                    objectives
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
