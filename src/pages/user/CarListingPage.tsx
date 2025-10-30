import { useEffect, useState } from "react";
import { useCars } from "../../context/CarContext";
import { CarCard } from "../../components/user/CarCard";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { CarFilters, SortOption } from "@/types";

export const CarListingPage: React.FC = () => {
  const { cars, loading, searchCars, setFilters, setSortOption } = useCars();
  const [localFilters, setLocalFilters] = useState<Partial<CarFilters>>({
    search: "",
    category: "all",
    brand: "all",
    transmission: "all",
    fuelType: "all",
    minPrice: 0,
    maxPrice: 1000,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [localSort, setLocalSort] = useState<SortOption | undefined>(undefined);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = () => {
    setFilters(localFilters);
    setSortOption(localSort);
    searchCars();
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      category: "all",
      brand: "all",
      transmission: "all",
      fuelType: "all",
      minPrice: 0,
      maxPrice: 1000,
    };
    setLocalFilters(resetFilters);
    setLocalSort(undefined);
    setFilters(resetFilters);
    setSortOption(undefined);
    searchCars();
  };

  const updateFilter = (key: keyof CarFilters, value: string | number) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Cars</h1>
          <p className="text-muted-foreground">
            Find the perfect vehicle for your next journey
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by car name, brand, or model..."
                  value={localFilters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="ghost" onClick={handleReset}>
                <X className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  value={localFilters.category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="mt-1">
                  <option value="all">All Categories</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="luxury">Luxury</option>
                  <option value="sports">Sports</option>
                  <option value="electric">Electric</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  id="transmission"
                  value={localFilters.transmission}
                  onChange={(e) => updateFilter("transmission", e.target.value)}
                  className="mt-1">
                  <option value="all">All Types</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  id="fuelType"
                  value={localFilters.fuelType}
                  onChange={(e) => updateFilter("fuelType", e.target.value)}
                  className="mt-1">
                  <option value="all">All Types</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort">Sort By</Label>
                <Select
                  id="sort"
                  value={localSort || ""}
                  onChange={(e) =>
                    setLocalSort((e.target.value as SortOption) || undefined)
                  }
                  className="mt-1">
                  <option value="">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="minPrice">Min Price ($/day)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  min="0"
                  value={localFilters.minPrice}
                  onChange={(e) =>
                    updateFilter("minPrice", Number(e.target.value))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="maxPrice">Max Price ($/day)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  min="0"
                  value={localFilters.maxPrice}
                  onChange={(e) =>
                    updateFilter("maxPrice", Number(e.target.value))
                  }
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">
            {loading
              ? "Searching..."
              : `Found ${cars.length} car${cars.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Car Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 bg-white rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : cars.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-xl text-muted-foreground mb-2">No cars found</p>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search filters
            </p>
            <Button onClick={handleReset}>Reset Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarListingPage;
