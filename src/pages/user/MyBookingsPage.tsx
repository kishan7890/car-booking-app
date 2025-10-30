import { useEffect, useState } from "react";
import { useBookings } from "../../context/BookingContext";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Select } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Calendar, MapPin, Clock, DollarSign, X } from "lucide-react";
import {
  formatCurrency,
  formatDateTime,
  capitalize,
} from "../../utils/helpers";

export const MyBookingsPage: React.FC = () => {
  const {
    bookings,
    loading,
    fetchUserBookings,
    cancelBooking,
    filters,
    setFilters,
  } = useBookings();
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  useEffect(() => {
    setFilters({ ...filters, status: selectedStatus });
    fetchUserBookings();
  }, [selectedStatus]);

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await cancelBooking(id);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to cancel booking"
      );
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your car bookings
          </p>
        </div>

        {/* Filter */}
        <Card className="p-4 mb-6">
          <div className="flex items-center space-x-4">
            <Label htmlFor="statusFilter" className="whitespace-nowrap">
              Filter by status:
            </Label>
            <Select
              id="statusFilter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-48">
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>
        </Card>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-white rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Car Image */}
                  <div className="lg:w-48 flex-shrink-0">
                    <img
                      src={booking.carDetails.image}
                      alt={booking.carDetails.name}
                      className="w-full h-32 lg:h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {booking.carDetails.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Booking ID: {booking.id}
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {capitalize(booking.status)}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start space-x-2">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Pickup</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(booking.pickupDateTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Return</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(booking.returnDateTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.pickupLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Total Cost</p>
                          <p className="text-sm font-semibold text-primary">
                            {formatCurrency(booking.totalCost)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.numberOfDays} day
                            {booking.numberOfDays !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium mb-1">
                          Special Requests:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {booking.specialRequests}
                        </p>
                      </div>
                    )}

                    {booking.status === "rejected" &&
                      booking.rejectionReason && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm font-medium text-red-800 mb-1">
                            Rejection Reason:
                          </p>
                          <p className="text-sm text-red-700">
                            {booking.rejectionReason}
                          </p>
                        </div>
                      )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <p>Booked on: {formatDateTime(booking.createdAt)}</p>
                      {booking.status === "pending" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-6">
              {selectedStatus === "all"
                ? "You haven't made any bookings yet"
                : `No ${selectedStatus} bookings found`}
            </p>
            <Button onClick={() => (window.location.href = "/cars")}>
              Browse Cars
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
