// User types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends Omit<User, "password"> {
  token: string;
}

// Car types
export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: "sedan" | "suv" | "hatchback" | "luxury" | "sports" | "electric";
  transmission: "automatic" | "manual";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  seatingCapacity: number;
  color: string;
  pricePerDay: number;
  weekendPrice?: number;
  weeklyDiscount?: number;
  images: string[];
  features: string[];
  description: string;
  location: string;
  mileage: string;
  isAvailable: boolean;
  rating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

// Booking types
export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  carId: string;
  carDetails: {
    name: string;
    model: string;
    image: string;
    pricePerDay: number;
  };
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  returnDateTime: string;
  numberOfDays: number;
  totalCost: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  specialRequests?: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Filter and Sort types
export interface CarFilters {
  search: string;
  category: string;
  brand: string;
  transmission: string;
  fuelType: string;
  minPrice: number;
  maxPrice: number;
  seatingCapacity: number;
}

export type SortOption = "price-asc" | "price-desc" | "rating" | "newest";

export interface BookingFilters {
  status: string;
  dateFrom?: string;
  dateTo?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface BookingFormData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  returnDateTime: string;
  specialRequests?: string;
  termsAccepted: boolean;
}

export interface CarFormData {
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  fuelType: string;
  seatingCapacity: number;
  color: string;
  pricePerDay: number;
  weekendPrice?: number;
  weeklyDiscount?: number;
  images: string[];
  features: string[];
  description: string;
  location: string;
  mileage: string;
  isAvailable: boolean;
  rating?: number;
  totalReviews?: number;
}

// Stats types
export interface DashboardStats {
  totalCars: number;
  totalBookings: number;
  pendingApprovals: number;
  totalRevenue: number;
  thisMonthBookings: number;
  popularCars: { car: Car; bookingCount: number }[];
}
