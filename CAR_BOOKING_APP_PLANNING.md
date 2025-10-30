# Car Booking Application - Project Planning & Enhanced Requirement Document

## Enhanced Project Prompt

### Project Overview

Build a comprehensive car booking application using React TypeScript, Tailwind CSS, and shadcn/ui components. The application will feature role-based access with two user types (Admin and User), complete booking workflow with approval system, and initially use dummy JSON data before backend integration.

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API / Zustand / Redux Toolkit
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **Data Storage (Phase 1)**: localStorage with dummy JSON
- **Date Handling**: date-fns or dayjs
- **HTTP Client (Phase 2)**: Axios or Fetch API
- **Authentication (Phase 1)**: JWT tokens in localStorage (mock authentication)
- **Backend (Phase 2)**: Node.js + Express + MongoDB/PostgreSQL

---

## Detailed Feature Requirements

### 1. Authentication & Authorization

#### 1.1 User Roles

- **Admin**: Full control over car inventory and booking approvals
- **User**: Can browse cars, make bookings, and view booking history

#### 1.2 Authentication Features

- **Login Page**: Email/username and password authentication
- **Registration Page**: Separate registration for users (admin accounts pre-configured)
- **Role-based Routing**: Protected routes based on user role
- **Session Management**: Token-based authentication with auto-logout on expiry
- **Password Security**: Password validation rules (min 8 chars, special chars, etc.)

#### 1.3 Mock Authentication (Phase 1)

```json
// Dummy users in localStorage
{
  "users": [
    {
      "id": "1",
      "email": "admin@carbooking.com",
      "password": "Admin@123",
      "role": "admin",
      "name": "Admin User"
    },
    {
      "id": "2",
      "email": "user@carbooking.com",
      "password": "User@123",
      "role": "user",
      "name": "John Doe"
    }
  ]
}
```

---

### 2. User Features

#### 2.1 Car Browsing

- **Car Listing Page**: Display all available cars in a grid/card layout
- **Search & Filters**:
  - Search by car name, model, brand
  - Filter by: Brand, Category (Sedan, SUV, Hatchback, Luxury, etc.)
  - Filter by: Price range, Transmission type, Fuel type
  - Filter by: Availability for selected dates
- **Sorting Options**: Price (low to high, high to low), Rating, Newest
- **Car Cards**: Display car image, name, model, price per day, rating, key features

#### 2.2 Car Details Page

- **Comprehensive Information**:
  - High-quality images (carousel/gallery)
  - Car specifications: Year, Brand, Model, Color
  - Features: Transmission, Fuel type, Seating capacity, AC, GPS, etc.
  - Pricing: Per day rate, weekend rates, weekly discounts
  - Availability calendar
  - Terms & conditions
- **Booking Button**: Redirects to booking form

#### 2.3 Booking System

- **Booking Form**:
  - User details (pre-filled if logged in)
  - Contact: Phone number, alternate email
  - Pickup location & Drop-off location
  - Pickup date & time
  - Return date & time
  - Number of days (auto-calculated)
  - Total cost (auto-calculated based on dates and car price)
  - Special requests/notes (textarea)
  - Terms & conditions checkbox
- **Form Validation**: All fields validated with appropriate error messages
- **Booking Confirmation**: Success message with booking reference number
- **Booking Status**: "Pending Approval" initially

#### 2.4 User Dashboard

- **My Bookings**: View all bookings (current, past, pending, approved, rejected)
- **Booking Filters**: Filter by status (All, Pending, Approved, Rejected, Completed)
- **Booking Details**: View full booking information
- **Cancel Booking**: Option to cancel pending bookings
- **Profile Management**: Update user profile information

---

### 3. Admin Features

#### 3.1 Admin Dashboard

- **Overview Statistics**:
  - Total cars in inventory
  - Total bookings (all time, this month)
  - Pending approvals count
  - Revenue metrics (mock data)
  - Popular cars
- **Quick Actions**: Add new car, View pending bookings

#### 3.2 Car Management

- **Car Inventory Table**: List all cars with columns:
  - Image thumbnail
  - Car name & model
  - Brand & Category
  - Price per day
  - Availability status
  - Actions (Edit, Delete, View)
- **Add New Car Form**:
  - Basic Details: Name, Brand, Model, Year, Color
  - Category: Dropdown (Sedan, SUV, Hatchback, Luxury, Sports, etc.)
  - Specifications: Transmission, Fuel type, Seating capacity, Mileage
  - Features: Multi-select checkboxes (AC, GPS, Bluetooth, Sunroof, etc.)
  - Pricing: Base price per day, weekend price, weekly discount %
  - Images: Multiple image upload (with preview)
  - Location: Pickup location
  - Availability: Available/Not Available toggle
  - Description: Rich text editor for car description
- **Edit Car**: Same form as add, pre-filled with existing data
- **Delete Car**: Confirmation modal before deletion
- **Bulk Actions**: Select multiple cars to delete or update status

#### 3.3 Booking Management

- **Booking Requests Table**: List all bookings with filters
  - Columns: Booking ID, User name, Car, Dates, Status, Amount, Actions
  - Filter by: Status (Pending, Approved, Rejected, Completed)
  - Filter by: Date range
  - Search by: Booking ID, User name, Car name
- **Booking Details Modal**:
  - User information
  - Car details
  - Booking dates & duration
  - Pricing breakdown
  - Special requests
- **Approve/Reject Actions**:
  - Approve button: Changes status to "Approved" with confirmation
  - Reject button: Opens modal to enter rejection reason
  - Email notification (mock in Phase 1, real in Phase 2)
- **Booking History**: View completed and cancelled bookings

#### 3.4 User Management (Optional)

- View all registered users
- Enable/disable user accounts
- View user booking history

---

## Data Models

### Car Object

```typescript
interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: "sedan" | "suv" | "hatchback" | "luxury" | "sports" | "electric";
  transmission: "automatic" | "manual";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  seatingCapacity: number;
  color: string;
  pricePerDay: number;
  weekendPrice?: number;
  weeklyDiscount?: number;
  images: string[]; // Array of image URLs
  features: string[]; // ['AC', 'GPS', 'Bluetooth', 'Sunroof']
  description: string;
  location: string;
  mileage: string;
  isAvailable: boolean;
  rating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Booking Object

```typescript
interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  carId: string;
  carDetails: {
    name: string;
    model: string;
    image: string;
  };
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  returnDateTime: string;
  numberOfDays: number;
  totalCost: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  specialRequests?: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### User Object

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed in backend
  phone?: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## Application Architecture

### Folder Structure

```
booking-app/
├── public/
│   └── cars/              # Car images
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn components (button, card, dialog, etc.)
│   │   ├── common/       # Shared components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── user/         # User-specific components
│   │   │   ├── CarCard.tsx
│   │   │   ├── CarDetails.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── BookingCard.tsx
│   │   │   └── CarFilters.tsx
│   │   └── admin/        # Admin-specific components
│   │       ├── CarForm.tsx
│   │       ├── CarTable.tsx
│   │       ├── BookingTable.tsx
│   │       ├── BookingDetailsModal.tsx
│   │       └── DashboardStats.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── user/
│   │   │   ├── HomePage.tsx
│   │   │   ├── CarListingPage.tsx
│   │   │   ├── CarDetailsPage.tsx
│   │   │   ├── BookingPage.tsx
│   │   │   └── MyBookingsPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── ManageCars.tsx
│   │       └── ManageBookings.tsx
│   ├── context/          # React Context for state
│   │   ├── AuthContext.tsx
│   │   ├── CarContext.tsx
│   │   └── BookingContext.tsx
│   ├── hooks/            # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCars.ts
│   │   └── useBookings.ts
│   ├── services/         # API/Data services
│   │   ├── authService.ts
│   │   ├── carService.ts
│   │   └── bookingService.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── dateHelpers.ts
│   │   └── localStorage.ts
│   ├── types/
│   │   └── index.ts      # TypeScript interfaces
│   ├── data/
│   │   └── dummyData.json  # Initial dummy data
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── README.md
```

### Routing Structure

```
/ → Home Page (public)
/login → Login Page
/register → Register Page

/cars → Car Listing (user)
/cars/:id → Car Details (user)
/book/:carId → Booking Form (user, protected)
/my-bookings → User's Bookings (user, protected)
/profile → User Profile (user, protected)

/admin → Admin Dashboard (admin, protected)
/admin/cars → Manage Cars (admin, protected)
/admin/cars/add → Add New Car (admin, protected)
/admin/cars/edit/:id → Edit Car (admin, protected)
/admin/bookings → Manage Bookings (admin, protected)
```

---

## Implementation Phases

### Phase 1: Frontend with Dummy Data (Current Scope)

#### Week 1: Setup & Authentication

- [ ] Initialize React + TypeScript + Tailwind + shadcn setup
- [ ] Install required dependencies
- [ ] Setup folder structure
- [ ] Create dummy data JSON file
- [ ] Implement localStorage utilities
- [ ] Create AuthContext and authentication logic
- [ ] Build Login and Register pages
- [ ] Implement ProtectedRoute component
- [ ] Setup React Router with all routes

#### Week 2: User Interface - Car Browsing

- [ ] Create Car context and services
- [ ] Build HomePage with featured cars
- [ ] Build CarListingPage with grid layout
- [ ] Implement CarCard component
- [ ] Add search functionality
- [ ] Add filter components (category, price, transmission, etc.)
- [ ] Add sorting options
- [ ] Build CarDetailsPage with image carousel
- [ ] Implement car availability check

#### Week 3: User Interface - Booking System

- [ ] Create Booking context and services
- [ ] Build BookingForm component with validation
- [ ] Implement date picker and duration calculation
- [ ] Add total cost calculation
- [ ] Create booking confirmation UI
- [ ] Build MyBookingsPage
- [ ] Implement BookingCard component
- [ ] Add booking status filters
- [ ] Implement cancel booking functionality

#### Week 4: Admin Interface

- [ ] Build AdminDashboard with statistics
- [ ] Create CarTable component for car management
- [ ] Build CarForm for add/edit car
- [ ] Implement image upload with preview
- [ ] Add delete car functionality
- [ ] Create BookingTable component
- [ ] Build BookingDetailsModal
- [ ] Implement approve/reject booking actions
- [ ] Add booking filters and search

#### Week 5: Polish & Testing

- [ ] Implement responsive design for all pages
- [ ] Add loading states and error handling
- [ ] Create toast notifications for actions
- [ ] Add form validation messages
- [ ] Implement pagination for lists
- [ ] Add empty states
- [ ] Test all user flows
- [ ] Fix bugs and refine UI/UX
- [ ] Write documentation

### Phase 2: Backend Integration (Future Scope)

#### Backend Development

- [ ] Setup Node.js + Express server
- [ ] Setup database (MongoDB/PostgreSQL)
- [ ] Create database models (User, Car, Booking)
- [ ] Implement JWT authentication
- [ ] Create RESTful API endpoints:
  - Auth: POST /api/auth/register, POST /api/auth/login
  - Cars: GET/POST /api/cars, GET/PUT/DELETE /api/cars/:id
  - Bookings: GET/POST /api/bookings, PUT /api/bookings/:id/approve, PUT /api/bookings/:id/reject
- [ ] Add input validation and error handling
- [ ] Implement file upload for car images
- [ ] Add email notification service (Nodemailer)

#### Frontend Integration

- [ ] Replace localStorage with API calls
- [ ] Update all services to use backend APIs
- [ ] Add proper error handling for API failures
- [ ] Implement loading states
- [ ] Add token refresh mechanism
- [ ] Handle file uploads to backend
- [ ] Test end-to-end flows

#### Additional Features

- [ ] Real-time notifications (Socket.io)
- [ ] Email notifications for booking status
- [ ] Payment integration (Stripe/PayPal)
- [ ] PDF generation for booking confirmations
- [ ] Reviews and ratings system
- [ ] Advanced analytics for admin
- [ ] Multi-language support
- [ ] Dark mode

---

## UI/UX Considerations

### Design System

- **Color Scheme**:
  - Primary: Blue (#2563eb) for CTAs and links
  - Secondary: Gray for backgrounds and borders
  - Success: Green for approved status
  - Warning: Yellow for pending status
  - Danger: Red for rejected/cancel actions
- **Typography**: Inter or Poppins font family
- **Spacing**: Consistent padding and margins using Tailwind spacing scale
- **Components**: Use shadcn/ui for consistency (Button, Card, Dialog, Form, Input, Select, etc.)

### Key UI Components Needed

- Button (primary, secondary, outline, destructive variants)
- Card
- Dialog/Modal
- Form (with field, label, error message)
- Input, Textarea, Select
- Checkbox, Radio
- DatePicker (use react-day-picker)
- Carousel (for car images)
- Tabs
- Badge (for status)
- Table
- Pagination
- Toast/Notification
- Dropdown Menu
- Avatar
- Skeleton (loading state)

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Hamburger menu for mobile navigation
- Collapsible filters on mobile
- Stack cards on mobile, grid on desktop

---

## Dummy Data Examples

### Sample Cars Data (20-30 cars)

```json
[
  {
    "id": "car-001",
    "name": "Tesla Model 3",
    "brand": "Tesla",
    "model": "Model 3",
    "year": 2024,
    "category": "electric",
    "transmission": "automatic",
    "fuelType": "electric",
    "seatingCapacity": 5,
    "color": "Pearl White",
    "pricePerDay": 120,
    "weekendPrice": 150,
    "images": ["/cars/tesla-model3-1.jpg", "/cars/tesla-model3-2.jpg"],
    "features": ["AC", "GPS", "Bluetooth", "Autopilot", "Premium Audio"],
    "description": "Experience the future of driving...",
    "location": "Downtown Station",
    "mileage": "272 miles",
    "isAvailable": true,
    "rating": 4.8,
    "totalReviews": 124
  }
  // More cars...
]
```

---

## Testing Strategy

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Admin login
- [ ] Browse cars as guest and logged-in user
- [ ] Filter and search cars
- [ ] View car details
- [ ] Create booking as user
- [ ] View my bookings
- [ ] Cancel pending booking
- [ ] Admin: Add new car with images
- [ ] Admin: Edit existing car
- [ ] Admin: Delete car
- [ ] Admin: View all bookings
- [ ] Admin: Approve booking
- [ ] Admin: Reject booking with reason
- [ ] Logout and session management

### Edge Cases to Handle

- Booking dates in the past
- Return date before pickup date
- Booking unavailable car
- Duplicate email registration
- Invalid login credentials
- Form validation errors
- Empty states (no cars, no bookings)
- Network errors (for Phase 2)

---

## Performance Optimization

- Lazy load routes with React.lazy
- Optimize images (WebP format, lazy loading)
- Implement pagination for large lists
- Debounce search inputs
- Memoize expensive calculations
- Use React.memo for components that don't need frequent re-renders

---

## Accessibility Considerations

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management in modals
- Alt text for all images
- Sufficient color contrast
- Form validation with screen reader support

---

## Security Best Practices (Phase 2)

- Password hashing (bcrypt)
- JWT token expiration
- Input sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- HTTPS only
- Secure file upload validation

---

## Success Metrics

- All user flows work without errors
- Responsive on all device sizes
- Forms validate properly
- Admin can manage cars and bookings efficiently
- User can browse and book cars seamlessly
- Data persists correctly in localStorage (Phase 1)
- Clean, maintainable, and well-documented code

---

## Next Steps

1. Review and finalize this plan
2. Setup development environment
3. Initialize project with all dependencies
4. Start with Phase 1, Week 1 tasks
5. Regular progress reviews after each week
6. Deploy Phase 1 to Vercel/Netlify for testing
7. Gather feedback before starting Phase 2

---

## Questions to Address Before Starting

1. Should we include a homepage with hero section and featured cars?
2. Do we need user profile editing functionality?
3. Should bookings have a time limit (e.g., minimum 1 day, maximum 30 days)?
4. Do we want to show booking conflicts (same car, overlapping dates)?
5. Should admin be able to manually mark bookings as "completed"?
6. Do we need a review/rating system for cars?
7. Should users receive any notifications in Phase 1 (UI notifications only)?
8. Do we want to track booking history for analytics?

---

**Document Version**: 1.0  
**Last Updated**: October 13, 2025  
**Prepared For**: Car Booking Application Development
