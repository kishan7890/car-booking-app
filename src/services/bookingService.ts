import type { Booking, BookingFormData, BookingFilters } from "../types";
import storage from "../utils/localStorage";
import { generateId, calculateDays } from "../utils/helpers";
import dummyData from "../data/dummyData.json";
import carService from "./carService";

// Initialize data from dummy JSON if not exists
const initializeData = () => {
  if (!storage.getBookings()) {
    storage.setBookings(dummyData.bookings);
  }
};

export const bookingService = {
  // Get all bookings
  getAllBookings: async (): Promise<Booking[]> => {
    initializeData();
    return (storage.getBookings() as Booking[]) || [];
  },

  // Get booking by ID
  getBookingById: async (id: string): Promise<Booking | null> => {
    initializeData();
    const bookings = (storage.getBookings() as Booking[]) || [];
    return bookings.find((booking) => booking.id === id) || null;
  },

  // Get bookings by user ID
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    initializeData();
    const bookings = (storage.getBookings() as Booking[]) || [];
    return bookings.filter((booking) => booking.userId === userId);
  },

  // Create booking
  createBooking: async (
    carId: string,
    userId: string,
    userName: string,
    userEmail: string,
    userPhone: string,
    data: BookingFormData
  ): Promise<Booking> => {
    initializeData();

    // Get car details
    const car = await carService.getCarById(carId);
    if (!car) {
      throw new Error("Car not found");
    }

    if (!car.isAvailable) {
      throw new Error("Car is not available");
    }

    // Calculate days and total cost
    const numberOfDays = calculateDays(
      data.pickupDateTime,
      data.returnDateTime
    );

    if (numberOfDays <= 0) {
      throw new Error("Return date must be after pickup date");
    }

    const totalCost = car.pricePerDay * numberOfDays;

    const bookings = (storage.getBookings() as Booking[]) || [];

    const newBooking: Booking = {
      id: generateId("booking"),
      userId,
      userName,
      userEmail,
      userPhone,
      carId,
      carDetails: {
        name: car.name,
        model: car.model,
        image: car.images[0],
        pricePerDay: car.pricePerDay,
      },
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      pickupDateTime: data.pickupDateTime,
      returnDateTime: data.returnDateTime,
      numberOfDays,
      totalCost,
      status: "pending",
      specialRequests: data.specialRequests,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    storage.setBookings(bookings);

    return newBooking;
  },

  // Update booking status (admin)
  updateBookingStatus: async (
    id: string,
    status: "approved" | "rejected" | "completed" | "cancelled",
    adminId?: string,
    rejectionReason?: string
  ): Promise<Booking> => {
    initializeData();
    const bookings = (storage.getBookings() as Booking[]) || [];
    const index = bookings.findIndex((booking) => booking.id === id);

    if (index === -1) {
      throw new Error("Booking not found");
    }

    const updatedBooking: Booking = {
      ...bookings[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    if (status === "approved" && adminId) {
      updatedBooking.approvedBy = adminId;
      updatedBooking.approvedAt = new Date().toISOString();
    }

    if (status === "rejected" && rejectionReason) {
      updatedBooking.rejectionReason = rejectionReason;
    }

    bookings[index] = updatedBooking;
    storage.setBookings(bookings);

    return updatedBooking;
  },

  // Cancel booking (user)
  cancelBooking: async (id: string, userId: string): Promise<Booking> => {
    initializeData();
    const bookings = (storage.getBookings() as Booking[]) || [];
    const index = bookings.findIndex((booking) => booking.id === id);

    if (index === -1) {
      throw new Error("Booking not found");
    }

    if (bookings[index].userId !== userId) {
      throw new Error("Unauthorized to cancel this booking");
    }

    if (bookings[index].status !== "pending") {
      throw new Error("Can only cancel pending bookings");
    }

    bookings[index] = {
      ...bookings[index],
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    };

    storage.setBookings(bookings);

    return bookings[index];
  },

  // Filter bookings
  filterBookings: async (filters: BookingFilters): Promise<Booking[]> => {
    initializeData();
    let bookings = (storage.getBookings() as Booking[]) || [];

    if (filters.status && filters.status !== "all") {
      bookings = bookings.filter(
        (booking) => booking.status === filters.status
      );
    }

    if (filters.dateFrom) {
      bookings = bookings.filter(
        (booking) => new Date(booking.createdAt) >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      bookings = bookings.filter(
        (booking) => new Date(booking.createdAt) <= new Date(filters.dateTo!)
      );
    }

    // Sort by newest first
    bookings.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return bookings;
  },

  // Get pending bookings count
  getPendingCount: async (): Promise<number> => {
    initializeData();
    const bookings = (storage.getBookings() as Booking[]) || [];
    return bookings.filter((booking) => booking.status === "pending").length;
  },

  // Get total revenue (mock)
  getTotalRevenue: async (): Promise<number> => {
    initializeData();
    const bookings = (storage.getBookings() as Booking[]) || [];
    return bookings
      .filter(
        (booking) =>
          booking.status === "approved" || booking.status === "completed"
      )
      .reduce((sum, booking) => sum + booking.totalCost, 0);
  },
};

export default bookingService;
