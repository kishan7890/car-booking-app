import { Link } from "react-router-dom";
import type { Car } from "@/types";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Star, Users, Fuel, Gauge } from "lucide-react";
import { formatCurrency } from "../../utils/helpers";

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.images[0]}
          alt={car.name}
          className="w-full h-full object-cover"
        />
        {!car.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              Not Available
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-md">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{car.rating || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold truncate">{car.name}</h3>
          <p className="text-sm text-muted-foreground">
            {car.brand} • {car.year}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{car.seatingCapacity}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Fuel className="h-4 w-4" />
            <span className="capitalize">{car.fuelType}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Gauge className="h-4 w-4" />
            <span className="capitalize">{car.transmission}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(car.pricePerDay)}
            </p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
          <div className="text-right">
            {car.totalReviews && (
              <p className="text-xs text-muted-foreground">
                {car.totalReviews} reviews
              </p>
            )}
          </div>
        </div>

        <Button asChild className="w-full" disabled={!car.isAvailable}>
          <Link to={`/cars/${car.id}`}>
            {car.isAvailable ? "View Details" : "Unavailable"}
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default CarCard;
