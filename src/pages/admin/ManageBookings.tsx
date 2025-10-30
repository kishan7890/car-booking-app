import { useEffect, useState } from "react";
import { useBookings } from "../../context/BookingContext";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Select } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Calendar, CheckCircle, XCircle, Eye } from "lucide-react";
import {
  formatCurrency,
  formatDateTime,
  capitalize,
} from "../../utils/helpers";
import type { Booking } from "@/types";

export const ManageBookings: React.FC = () => {
  const {
    bookings,
    loading,
    fetchAllBookings,
    approveBooking,
    rejectBooking,
    filters,
    setFilters,
  } = useBookings();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  useEffect(() => {
    setFilters({ ...filters, status: selectedStatus });
    fetchAllBookings();
  }, [selectedStatus]);

  const handleApprove = async (id: string) => {
    if (!window.confirm("Are you sure you want to approve this booking?")) {
      return;
    }

    setActionLoading(true);
    try {
      await approveBooking(id);
      alert("Booking approved successfully!");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to approve booking"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBooking || !rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setActionLoading(true);
    try {
      await rejectBooking(selectedBooking.id, rejectionReason);
      setRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedBooking(null);
      alert("Booking rejected successfully!");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to reject booking"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setRejectDialogOpen(true);
  };

  const openDetailsDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
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
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Manage Bookings</h1>
          <p className="text-muted-foreground">
            Review and manage all customer bookings
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
                        <p className="text-sm font-medium mt-1">
                          Customer: {booking.userName} ({booking.userEmail})
                        </p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {capitalize(booking.status)}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Pickup</p>
                        <p className="font-medium">
                          {formatDateTime(booking.pickupDateTime)}
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {booking.pickupLocation}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Return</p>
                        <p className="font-medium">
                          {formatDateTime(booking.returnDateTime)}
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {booking.dropoffLocation}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Cost</p>
                        <p className="font-bold text-primary text-lg">
                          {formatCurrency(booking.totalCost)}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {booking.numberOfDays} day
                          {booking.numberOfDays !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Booked: {formatDateTime(booking.createdAt)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetailsDialog(booking)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApprove(booking.id)}
                              disabled={actionLoading}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openRejectDialog(booking)}
                              disabled={actionLoading}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
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
            <p className="text-muted-foreground">
              {selectedStatus === "all"
                ? "No bookings have been made yet"
                : `No ${selectedStatus} bookings found`}
            </p>
          </Card>
        )}

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Booking</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this booking. The customer
                will be notified.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="rejectionReason">Rejection Reason</Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRejectDialogOpen(false);
                    setRejectionReason("");
                    setSelectedBooking(null);
                  }}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={actionLoading || !rejectionReason.trim()}>
                  {actionLoading ? "Rejecting..." : "Reject Booking"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4 mt-4 text-sm">
                <div>
                  <p className="font-medium">Car:</p>
                  <p>{selectedBooking.carDetails.name}</p>
                </div>
                <div>
                  <p className="font-medium">Customer:</p>
                  <p>{selectedBooking.userName}</p>
                  <p className="text-muted-foreground">
                    {selectedBooking.userEmail}
                  </p>
                  <p className="text-muted-foreground">
                    {selectedBooking.userPhone}
                  </p>
                </div>
                {selectedBooking.specialRequests && (
                  <div>
                    <p className="font-medium">Special Requests:</p>
                    <p className="text-muted-foreground">
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                )}
                {selectedBooking.rejectionReason && (
                  <div>
                    <p className="font-medium text-red-600">
                      Rejection Reason:
                    </p>
                    <p className="text-red-700">
                      {selectedBooking.rejectionReason}
                    </p>
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={() => setDetailsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageBookings;
