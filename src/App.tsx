import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CarProvider } from "./context/CarContext";
import { BookingProvider } from "./context/BookingContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User Pages
import HomePage from "./pages/user/HomePage";
import CarListingPage from "./pages/user/CarListingPage";
import CarDetailsPage from "./pages/user/CarDetailsPage";
import BookingPage from "./pages/user/BookingPage";
import MyBookingsPage from "./pages/user/MyBookingsPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCars from "./pages/admin/ManageCars";
import ManageBookings from "./pages/admin/ManageBookings";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CarProvider>
          <BookingProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/cars" element={<CarListingPage />} />
                  <Route path="/cars/:id" element={<CarDetailsPage />} />

                  {/* User Protected Routes */}
                  <Route
                    path="/book/:carId"
                    element={
                      <ProtectedRoute requireUser>
                        <BookingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute requireUser>
                        <MyBookingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute requireUser>
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-3xl font-bold mb-4">
                              Profile Page
                            </h1>
                            <p className="text-muted-foreground">
                              Profile management coming soon...
                            </p>
                          </div>
                        </div>
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/cars"
                    element={
                      <ProtectedRoute requireAdmin>
                        <ManageCars />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/bookings"
                    element={
                      <ProtectedRoute requireAdmin>
                        <ManageBookings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch all - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BookingProvider>
        </CarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
