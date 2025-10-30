import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Car, BookingFormData } from "@/types";
import carService from "../../services/carService";
import { useBookings } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Card } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { formatCurrency, calculateDays } from "../../utils/helpers";
import { format } from "date-fns";

const bookingSchema = z.object({
  pickupLocation: z.string().min(3, "Pickup location is required"),
  dropoffLocation: z.string().min(3, "Drop-off location is required"),
  pickupDateTime: z.string().min(1, "Pickup date/time is required"),
  returnDateTime: z.string().min(1, "Return date/time is required"),
  specialRequests: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type FormData = z.infer<typeof bookingSchema>;

export const BookingPage: React.FC = () => {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
      termsAccepted: false,
    },
  });

  const pickupDateTime = watch("pickupDateTime");
  const returnDateTime = watch("returnDateTime");

  const days =
    pickupDateTime && returnDateTime
      ? calculateDays(pickupDateTime, returnDateTime)
      : 0;

  const totalCost = car && days > 0 ? car.pricePerDay * days : 0;

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) return;

      try {
        const data = await carService.getCarById(carId);
        setCar(data);
      } catch (error) {
        console.error("Error fetching car:", error);
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  const onSubmit = async (data: FormData) => {
    if (!car || !carId) return;

    setSubmitting(true);
    setError(null);

    try {
      await createBooking(carId, data);
      setSuccess(true);

      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col space-y-4">
        <p className="text-xl text-muted-foreground">Car not found</p>
        <Button onClick={() => navigate("/cars")}>Back to Listings</Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your booking request has been submitted successfully. You will be
            redirected to your bookings page.
          </p>
          <p className="text-sm text-muted-foreground">
            Please wait for admin approval to confirm your booking.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
        <p className="text-muted-foreground mb-8">
          Fill in the details below to book this vehicle
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={user?.name || ""}
                        disabled
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    <MapPin className="inline h-5 w-5 mr-2" />
                    Pickup & Drop-off
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pickupLocation">Pickup Location</Label>
                      <Input
                        id="pickupLocation"
                        placeholder="Enter pickup location"
                        {...register("pickupLocation")}
                        className="mt-1"
                      />
                      {errors.pickupLocation && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.pickupLocation.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="dropoffLocation">Drop-off Location</Label>
                      <Input
                        id="dropoffLocation"
                        placeholder="Enter drop-off location"
                        {...register("dropoffLocation")}
                        className="mt-1"
                      />
                      {errors.dropoffLocation && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.dropoffLocation.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    <Calendar className="inline h-5 w-5 mr-2" />
                    Rental Period
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pickupDateTime">Pickup Date & Time</Label>
                      <Input
                        id="pickupDateTime"
                        type="datetime-local"
                        min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                        {...register("pickupDateTime")}
                        className="mt-1"
                      />
                      {errors.pickupDateTime && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.pickupDateTime.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="returnDateTime">Return Date & Time</Label>
                      <Input
                        id="returnDateTime"
                        type="datetime-local"
                        min={
                          pickupDateTime ||
                          format(new Date(), "yyyy-MM-dd'T'HH:mm")
                        }
                        {...register("returnDateTime")}
                        className="mt-1"
                      />
                      {errors.returnDateTime && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.returnDateTime.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {days > 0 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Duration: {days} day{days !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="specialRequests">
                    Special Requests (Optional)
                  </Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Any special requirements or requests..."
                    rows={4}
                    {...register("specialRequests")}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="termsAccepted"
                    {...register("termsAccepted")}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="termsAccepted" className="cursor-pointer">
                      I agree to the terms and conditions
                    </Label>
                    {errors.termsAccepted && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.termsAccepted.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Booking Request"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={car.images[0]}
                    alt={car.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{car.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {car.brand} {car.model}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per day</span>
                    <span className="font-medium">
                      {formatCurrency(car.pricePerDay)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Number of days
                    </span>
                    <span className="font-medium">{days > 0 ? days : "-"}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {totalCost > 0 ? formatCurrency(totalCost) : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 text-xs text-muted-foreground space-y-2">
                <p>• Booking requires admin approval</p>
                <p>• You will be notified via email</p>
                <p>• Free cancellation for pending bookings</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
