// Frontend Types for RentMatch Application

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User Types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  userType: "tenant" | "landlord" | "admin";
  isVerified: boolean;
  isActive: boolean;
  tenantId?: string; // For tenant users
  createdAt: string;
  updatedAt: string;
}

// Profile Management Types
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  profileImage?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Tenant Types
export interface ITenant {
  _id: string;
  userId: string;
  preferences: {
    budget: {
      min: number;
      max: number;
    };
    preferredLocation: string;
    requiredAmenities: string[];
    preferredBedrooms: number;
    preferredBathrooms: number;
    maxCommute?: number; // in minutes
  };
  searchHistory: string[];
  savedProperties: string[];
  createdAt: string;
  updatedAt: string;
}

// Property Types
export interface IProperty {
  _id: string;
  landlordId: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  rent: number;
  bedrooms: number;
  bathrooms: number;
  size?: number; // in square meters
  amenities: string[];
  images: string[];
  status: "available" | "occupied" | "maintenance" | "pending";
  features: {
    furnished: boolean;
    petFriendly: boolean;
    parking: boolean;
    balcony: boolean;
  };
  utilities: {
    electricity: boolean;
    water: boolean;
    internet: boolean;
    gas: boolean;
  };
  createdAt: string;
  updatedAt: string;
  views: number;
  inquiries: number;
}

// Linear Programming Types
export interface OptimizationConstraints {
  tenantId?: string;
  budget: {
    min: number;
    max: number;
  };
  location: string;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxCommute?: number;
}

export interface OptimizationWeights {
  budget: number;
  location: number;
  amenities: number;
  size: number;
  commute?: number;
}

export interface PropertyMatch {
  propertyId: string;
  tenantId: string | undefined;
  matchScore: number;
  matchDetails: {
    budgetScore: number;
    locationScore: number;
    amenityScore: number;
    sizeScore: number;
    commuteScore?: number;
  };
  explanation: string[];
  calculatedAt: string;
}

export interface OptimizationResult {
  matches: PropertyMatch[];
  optimizationDetails: {
    algorithm: "linear_programming";
    executionTime: number;
    constraintsSatisfied: string[];
    objectiveValue: number;
    totalPropertiesEvaluated: number;
    feasibleSolutions: number;
  };
  weights: OptimizationWeights;
  constraints: OptimizationConstraints;
}

// Communication Types
export interface IMessage {
  _id: string;
  fromUserId: string;
  toUserId: string;
  propertyId?: string;
  subject: string;
  message: string;
  messageType: "inquiry" | "viewing_request" | "general" | "system";
  status: "sent" | "read" | "replied";
  createdAt: string;
  updatedAt: string;
}

export interface IViewing {
  _id: string;
  tenantId: string;
  landlordId: string;
  propertyId: string;
  requestedDate: string;
  requestedTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface OptimizationStats {
  totalOptimizations: number;
  averageExecutionTime: number;
  averageMatchScore: number;
  constraintsSatisfactionRate: number;
  mostRequestedAmenities: Array<{
    amenity: string;
    count: number;
  }>;
  popularLocations: Array<{
    location: string;
    count: number;
  }>;
  budgetDistribution: Array<{
    range: string;
    count: number;
  }>;
}

// Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  userType: "tenant" | "landlord";
  preferences?: Partial<ITenant["preferences"]>;
}

export interface PropertyCreateRequest {
  title: string;
  description: string;
  location: IProperty["location"];
  rent: number;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  amenities: string[];
  features: IProperty["features"];
  utilities: IProperty["utilities"];
}

export interface OptimizationRequest {
  tenantId?: string;
  constraints: OptimizationConstraints;
  weights?: Partial<OptimizationWeights>;
  maxResults?: number;
}

// Populated Types (for API responses with populated fields)
export interface PopulatedMessage extends Omit<IMessage, 'fromUserId' | 'toUserId' | 'propertyId'> {
  fromUserId: IUser;
  toUserId: IUser;
  propertyId?: IProperty;
}

export interface PopulatedViewing extends Omit<IViewing, 'tenantId' | 'landlordId' | 'propertyId'> {
  tenantId: IUser;
  landlordId: IUser;
  propertyId: IProperty;
}

export interface PopulatedTenant extends Omit<ITenant, 'userId' | 'searchHistory' | 'savedProperties'> {
  userId: IUser;
  searchHistory: IProperty[];
  savedProperties: IProperty[];
} 