import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Car as CarIcon, Calendar, Clock, DollarSign } from "lucide-react";
import carService from "../../services/carService";
import bookingService from "../../services/bookingService";
import { formatCurrency } from "../../utils/helpers";

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cars, bookings, pendingCount, revenue] = await Promise.all([
          carService.getAllCars(),
          bookingService.getAllBookings(),
          bookingService.getPendingCount(),
          bookingService.getTotalRevenue(),
        ]);

        setStats({
          totalCars: cars.length,
          totalBookings: bookings.length,
          pendingApprovals: pendingCount,
          totalRevenue: revenue,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Cars",
      value: stats.totalCars,
      icon: CarIcon,
      color: "bg-blue-500",
      link: "/admin/cars",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-green-500",
      link: "/admin/bookings",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Clock,
      color: "bg-yellow-500",
      link: "/admin/bookings?filter=pending",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-purple-500",
      link: "/admin/bookings",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your car booking platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mb-3">{stat.title}</p>
              <Link to={stat.link}>
                <Button variant="ghost" size="sm" className="w-full">
                  View Details →
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link to="/admin/cars/add">
                  <CarIcon className="h-5 w-5 mr-2" />
                  Add New Car
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/admin/bookings">
                  <Calendar className="h-5 w-5 mr-2" />
                  Manage Bookings
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/admin/cars">
                  <CarIcon className="h-5 w-5 mr-2" />
                  View All Cars
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {stats.pendingApprovals > 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">
                    You have {stats.pendingApprovals} booking
                    {stats.pendingApprovals !== 1 ? "s" : ""} pending approval
                  </p>
                  <Button
                    asChild
                    variant="link"
                    className="text-yellow-700 p-0 h-auto mt-2">
                    <Link to="/admin/bookings">Review Now →</Link>
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    All bookings are up to date!
                  </p>
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Platform Status
                </p>
                <div className="space-y-1 text-xs text-blue-700">
                  <p>✓ All systems operational</p>
                  <p>✓ {stats.totalCars} cars available</p>
                  <p>✓ {stats.totalBookings} total bookings</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
