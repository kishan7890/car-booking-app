import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Booking, BookingFormData, BookingFilters } from "../types";
import bookingService from "../services/bookingService";
import { useAuth } from "./AuthContext";

interface BookingContextType {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  filters: BookingFilters;
  setFilters: (filters: BookingFilters) => void;
  fetchUserBookings: () => Promise<void>;
  fetchAllBookings: () => Promise<void>;
  createBooking: (carId: string, data: BookingFormData) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  approveBooking: (id: string) => Promise<void>;
  rejectBooking: (id: string, reason: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilters>({ status: "all" });

  const fetchUserBookings = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      await bookingService.getUserBookings(user.id);
      const filtered = await bookingService.filterBookings({ ...filters });
      setBookings(filtered.filter((b) => b.userId === user.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  const fetchAllBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.filterBookings(filters);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createBooking = useCallback(
    async (carId: string, data: BookingFormData) => {
      if (!user) throw new Error("User not authenticated");

      setLoading(true);
      setError(null);
      try {
        const booking = await bookingService.createBooking(
          carId,
          user.id,
          user.name,
          user.email,
          user.phone || "",
          data
        );
        await fetchUserBookings();
        return booking;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create booking";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, fetchUserBookings]
  );

  const cancelBooking = useCallback(
    async (id: string) => {
      if (!user) throw new Error("User not authenticated");

      setLoading(true);
      setError(null);
      try {
        await bookingService.cancelBooking(id, user.id);
        await fetchUserBookings();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to cancel booking";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, fetchUserBookings]
  );

  const approveBooking = useCallback(
    async (id: string) => {
      if (!user || !isAdmin) throw new Error("Unauthorized");

      setLoading(true);
      setError(null);
      try {
        await bookingService.updateBookingStatus(id, "approved", user.id);
        await fetchAllBookings();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to approve booking";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, isAdmin, fetchAllBookings]
  );

  const rejectBooking = useCallback(
    async (id: string, reason: string) => {
      if (!user || !isAdmin) throw new Error("Unauthorized");

      setLoading(true);
      setError(null);
      try {
        await bookingService.updateBookingStatus(
          id,
          "rejected",
          user.id,
          reason
        );
        await fetchAllBookings();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to reject booking";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, isAdmin, fetchAllBookings]
  );

  const refreshBookings = useCallback(async () => {
    if (isAdmin) {
      await fetchAllBookings();
    } else {
      await fetchUserBookings();
    }
  }, [isAdmin, fetchAllBookings, fetchUserBookings]);

  const value: BookingContextType = {
    bookings,
    loading,
    error,
    filters,
    setFilters,
    fetchUserBookings,
    fetchAllBookings,
    createBooking,
    cancelBooking,
    approveBooking,
    rejectBooking,
    refreshBookings,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

export const useBookings = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
};

export default BookingContext;
