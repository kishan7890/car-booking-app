import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Car } from "@/types";
import carService from "../../services/carService";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import {
  Star,
  Users,
  Fuel,
  Gauge,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { formatCurrency } from "../../utils/helpers";

export const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;

      try {
        const data = await carService.getCarById(id);
        setCar(data);
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isAdmin) {
      alert("Admin users cannot make bookings");
      return;
    }

    navigate(`/book/${car?.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading car details...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col space-y-4">
        <p className="text-xl text-muted-foreground">Car not found</p>
        <Button asChild>
          <Link to="/cars">Back to Listings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <Card className="overflow-hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {car.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video">
                        <img
                          src={image}
                          alt={`${car.name} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {car.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </>
                )}
              </Carousel>
            </Card>

            {/* Car Info */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
                  <p className="text-muted-foreground text-lg">
                    {car.brand} {car.model} • {car.year}
                  </p>
                </div>
                {car.rating && (
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-semibold">{car.rating}</span>
                    <span className="text-muted-foreground">
                      ({car.totalReviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Seats</p>
                    <p className="font-medium">{car.seatingCapacity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fuel</p>
                    <p className="font-medium capitalize">{car.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Transmission
                    </p>
                    <p className="font-medium capitalize">{car.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{car.location}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {car.description}
                </p>
              </div>

              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-3">Additional Info</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong>Category:</strong>{" "}
                    <span className="capitalize">{car.category}</span>
                  </p>
                  <p>
                    <strong>Color:</strong> {car.color}
                  </p>
                  <p>
                    <strong>Mileage:</strong> {car.mileage}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Price per day
                </p>
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(car.pricePerDay)}
                </p>
                {car.weekendPrice && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Weekend: {formatCurrency(car.weekendPrice)}
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Availability</span>
                  <span
                    className={`font-medium ${
                      car.isAvailable ? "text-green-600" : "text-red-600"
                    }`}>
                    {car.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pickup Location</span>
                  <span className="font-medium">{car.location}</span>
                </div>
              </div>

              <Button
                className="w-full mb-4"
                size="lg"
                onClick={handleBookNow}
                disabled={!car.isAvailable}>
                <Calendar className="h-4 w-4 mr-2" />
                {car.isAvailable ? "Book Now" : "Not Available"}
              </Button>

              {!isAuthenticated && (
                <p className="text-xs text-center text-muted-foreground">
                  Please{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    sign in
                  </Link>{" "}
                  to book this car
                </p>
              )}

              <div className="border-t pt-6 mt-6 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Instant booking confirmation</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Free cancellation up to 24 hours</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
