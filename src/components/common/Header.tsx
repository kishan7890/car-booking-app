import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { Car, LogOut, User, Settings, LayoutDashboard } from "lucide-react";

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">CarBooking</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/cars" className="hover:text-primary transition-colors">
            Browse Cars
          </Link>
          {isAuthenticated && !isAdmin && (
            <Link
              to="/my-bookings"
              className="hover:text-primary transition-colors">
              My Bookings
            </Link>
          )}
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link
                to="/admin/cars"
                className="hover:text-primary transition-colors">
                Manage Cars
              </Link>
              <Link
                to="/admin/bookings"
                className="hover:text-primary transition-colors">
                Manage Bookings
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
                {isAdmin && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Admin
                  </span>
                )}
              </div>
              {isAdmin ? (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
