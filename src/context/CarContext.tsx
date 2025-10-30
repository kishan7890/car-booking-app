import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Car, CarFilters, SortOption } from "@/types";
import carService from "../services/carService";

interface CarContextType {
  cars: Car[];
  loading: boolean;
  error: string | null;
  filters: Partial<CarFilters>;
  sortOption: SortOption | undefined;
  setFilters: (filters: Partial<CarFilters>) => void;
  setSortOption: (sort: SortOption | undefined) => void;
  fetchCars: () => Promise<void>;
  searchCars: () => Promise<void>;
  getCarById: (id: string) => Promise<Car | null>;
  refreshCars: () => Promise<void>;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<CarFilters>>({});
  const [sortOption, setSortOption] = useState<SortOption | undefined>(
    undefined
  );

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carService.getAllCars();
      setCars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await carService.searchCars(filters, sortOption);
      setCars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search cars");
    } finally {
      setLoading(false);
    }
  }, [filters, sortOption]);

  const getCarById = useCallback(async (id: string) => {
    try {
      return await carService.getCarById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch car");
      return null;
    }
  }, []);

  const refreshCars = useCallback(async () => {
    await searchCars();
  }, [searchCars]);

  const value: CarContextType = {
    cars,
    loading,
    error,
    filters,
    sortOption,
    setFilters,
    setSortOption,
    fetchCars,
    searchCars,
    getCarById,
    refreshCars,
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
};

export const useCars = (): CarContextType => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error("useCars must be used within a CarProvider");
  }
  return context;
};

export default CarContext;
