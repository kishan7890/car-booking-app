import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { CarCard } from "../../components/user/CarCard";
import { Car as CarIcon, Search, Shield, Clock } from "lucide-react";
import carService from "../../services/carService";
import type { Car } from "@/types";

export const HomePage: React.FC = () => {
  const [popularCars, setPopularCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        const cars = await carService.getPopularCars(6);
        setPopularCars(cars);
      } catch (error) {
        console.error("Error fetching popular cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCars();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Find Your Perfect Ride
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover a wide range of quality vehicles at competitive prices.
                Book your next adventure today!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/cars">Browse All Cars</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-black border-white hover:bg-white/10">
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-lg backdrop-blur-sm"></div>
                <CarIcon className="relative h-64 w-64 mx-auto text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-muted-foreground">
                Find the perfect car with our advanced search and filter options
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-muted-foreground">
                Your bookings are secure with our verified approval process
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our team is always here to help with your booking needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cars Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Popular Cars</h2>
              <p className="text-muted-foreground mt-2">
                Explore our most loved vehicles
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/cars">View All</Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : popularCars.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No cars available at the moment
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Hit the Road?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers who trust us for their car
            rental needs
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/cars">Start Booking Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
