import storage from "../utils/localStorage";
import { generateId } from "../utils/helpers";
import dummyData from "../data/dummyData.json";
import type { Car, CarFormData, CarFilters, SortOption } from "@/types";

// Initialize data from dummy JSON if not exists
const initializeData = () => {
  if (!storage.getCars()) {
    storage.setCars(dummyData.cars);
  }
};

export const carService = {
  // Get all cars
  getAllCars: async (): Promise<Car[]> => {
    initializeData();
    return (storage.getCars() as Car[]) || [];
  },

  // Get car by ID
  getCarById: async (id: string): Promise<Car | null> => {
    initializeData();
    const cars = (storage.getCars() as Car[]) || [];
    return cars.find((car) => car.id === id) || null;
  },

  // Get available cars
  getAvailableCars: async (): Promise<Car[]> => {
    initializeData();
    const cars = (storage.getCars() as Car[]) || [];
    return cars.filter((car) => car.isAvailable);
  },

  // Search and filter cars
  searchCars: async (
    filters: Partial<CarFilters>,
    sort?: SortOption
  ): Promise<Car[]> => {
    initializeData();
    let cars = (storage.getCars() as Car[]) || [];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      cars = cars.filter(
        (car) =>
          car.name.toLowerCase().includes(searchLower) ||
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category && filters.category !== "all") {
      cars = cars.filter((car) => car.category === filters.category);
    }

    if (filters.brand && filters.brand !== "all") {
      cars = cars.filter((car) => car.brand === filters.brand);
    }

    if (filters.transmission && filters.transmission !== "all") {
      cars = cars.filter((car) => car.transmission === filters.transmission);
    }

    if (filters.fuelType && filters.fuelType !== "all") {
      cars = cars.filter((car) => car.fuelType === filters.fuelType);
    }

    if (filters.minPrice !== undefined) {
      cars = cars.filter((car) => car.pricePerDay >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      cars = cars.filter((car) => car.pricePerDay <= filters.maxPrice!);
    }

    if (filters.seatingCapacity && filters.seatingCapacity > 0) {
      cars = cars.filter(
        (car) => car.seatingCapacity >= filters.seatingCapacity!
      );
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case "price-asc":
          cars.sort((a, b) => a.pricePerDay - b.pricePerDay);
          break;
        case "price-desc":
          cars.sort((a, b) => b.pricePerDay - a.pricePerDay);
          break;
        case "rating":
          cars.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "newest":
          cars.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
    }

    return cars;
  },

  // Add new car
  addCar: async (data: CarFormData): Promise<Car> => {
    initializeData();
    const cars = (storage.getCars() as Car[]) || [];

    const newCar: Car = {
      ...data,
      id: generateId("car"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Car;

    cars.push(newCar);
    storage.setCars(cars);

    return newCar;
  },

  // Update car
  updateCar: async (id: string, data: Partial<CarFormData>): Promise<Car> => {
    initializeData();
    const cars = (storage.getCars() as Car[]) || [];
    const index = cars.findIndex((car) => car.id === id);

    if (index === -1) {
      throw new Error("Car not found");
    }

    const updatedCar: Car = {
      ...cars[index],
      ...data,
      updatedAt: new Date().toISOString(),
    } as Car;

    cars[index] = updatedCar;
    storage.setCars(cars);

    return updatedCar;
  },

  // Delete car
  deleteCar: async (id: string): Promise<void> => {
    initializeData();
    const cars = (storage.getCars() as Car[]) || [];
    const filteredCars = cars.filter((car) => car.id !== id);

    if (filteredCars.length === cars.length) {
      throw new Error("Car not found");
    }

    storage.setCars(filteredCars);
  },

  // Get unique brands
  getBrands: async (): Promise<string[]> => {
    initializeData();
    const cars = (storage.getCars() as Car[]) || [];
    const brands = [...new Set(cars.map((car) => car.brand))];
    return brands.sort();
  },

  // Get popular cars (by rating and reviews)
  getPopularCars: async (limit: number = 6): Promise<Car[]> => {
    initializeData();
    const cars = (storage.getCars() as Car[]) || [];
    return cars
      .filter((car) => car.isAvailable)
      .sort((a, b) => {
        const scoreA = (a.rating || 0) * (a.totalReviews || 0);
        const scoreB = (b.rating || 0) * (b.totalReviews || 0);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  },
};

export default carService;
