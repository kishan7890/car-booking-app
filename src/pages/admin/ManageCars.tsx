import { useEffect, useState } from "react";
import type { Car, CarFormData } from "@/types";
import carService from "../../services/carService";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Plus, Search, Edit, Trash2, Car as CarIcon } from "lucide-react";
import { formatCurrency } from "../../utils/helpers";
import { CarFormDialog } from "../../components/admin/CarFormDialog";

export const ManageCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredCars(
        cars.filter(
          (car) =>
            car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCars(cars);
    }
  }, [searchTerm, cars]);

  const fetchCars = async () => {
    try {
      const data = await carService.getAllCars();
      setCars(data);
      setFilteredCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      await carService.deleteCar(id);
      alert("Car deleted successfully!");
      fetchCars();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete car");
    }
  };

  const handleToggleAvailability = async (car: Car) => {
    try {
      await carService.updateCar(car.id, { isAvailable: !car.isAvailable });
      fetchCars();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update car");
    }
  };

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedCar(null);
    setAddDialogOpen(true);
  };

  const handleSaveCar = async (data: {
    images: string;
    features: string;
    [key: string]: unknown;
  }) => {
    try {
      const carData: CarFormData = {
        ...data,
        images: data.images.split(",").map((url: string) => url.trim()),
        features: data.features.split(",").map((f: string) => f.trim()),
        rating: selectedCar?.rating,
        totalReviews: selectedCar?.totalReviews,
      } as CarFormData;

      if (selectedCar) {
        await carService.updateCar(selectedCar.id, carData);
        alert("Car updated successfully!");
      } else {
        await carService.addCar(carData);
        alert("Car added successfully!");
      }

      fetchCars();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save car");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Cars</h1>
            <p className="text-muted-foreground">
              View and manage your car inventory
            </p>
          </div>
          <Button size="lg" onClick={handleAdd}>
            <Plus className="h-5 w-5 mr-2" />
            Add New Car
          </Button>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search cars by name, brand, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Cars List */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 bg-white rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <Card key={car.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={car.images[0]}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={car.isAvailable ? "default" : "destructive"}>
                      {car.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1 truncate">
                    {car.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {car.brand} • {car.year} • {car.category}
                  </p>
                  <p className="text-2xl font-bold text-primary mb-4">
                    {formatCurrency(car.pricePerDay)}
                    <span className="text-sm text-muted-foreground font-normal">
                      {" "}
                      / day
                    </span>
                  </p>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleToggleAvailability(car)}>
                      {car.isAvailable ? "Mark Unavailable" : "Mark Available"}
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(car)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(car.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No cars found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "No cars match your search"
                : "No cars in inventory yet"}
            </p>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Car
            </Button>
          </Card>
        )}

        {/* Edit Dialog */}
        <CarFormDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          car={selectedCar}
          onSave={handleSaveCar}
        />

        {/* Add Dialog */}
        <CarFormDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          car={null}
          onSave={handleSaveCar}
        />
      </div>
    </div>
  );
};

export default ManageCars;
