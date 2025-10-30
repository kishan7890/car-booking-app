# Car Booking Application

A comprehensive car booking platform built with React, TypeScript, Tailwind CSS, and shadcn/ui components. The application features role-based access control, booking management, and a complete admin dashboard.

## 🚀 Features

### User Features

- **Browse Cars**: View available cars with advanced search and filtering
- **Car Details**: Detailed car information with image carousel
- **Book Cars**: Complete booking form with date selection and cost calculation
- **My Bookings**: View and manage personal bookings
- **Cancel Bookings**: Cancel pending bookings before approval

### Admin Features

- **Dashboard**: Overview with statistics and quick actions
- **Manage Cars**: Add, edit, delete, and toggle car availability
- **Manage Bookings**: Review, approve, or reject booking requests
- **Analytics**: Track total revenue, pending approvals, and more

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Date Handling**: date-fns
- **State Management**: React Context API
- **Data Storage**: localStorage (Phase 1)

## 📦 Installation

1. **Clone the repository**:

   ```bash
   cd booking-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## 🔑 Demo Credentials

### Admin Account

- **Email**: admin@carbooking.com
- **Password**: Admin@123

### User Account

- **Email**: user@carbooking.com
- **Password**: User@123

## 📁 Project Structure

```
booking-app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn UI components
│   │   ├── common/          # Shared components (Header, Footer, etc.)
│   │   ├── user/            # User-specific components
│   │   └── admin/           # Admin-specific components
│   ├── pages/
│   │   ├── auth/            # Login & Register pages
│   │   ├── user/            # User pages
│   │   └── admin/           # Admin pages
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CarContext.tsx
│   │   └── BookingContext.tsx
│   ├── services/            # API/Data services
│   │   ├── authService.ts
│   │   ├── carService.ts
│   │   └── bookingService.ts
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── data/                # Dummy data (JSON)
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── package.json
└── README.md
```

## 🎯 Key Functionalities

### Authentication System

- JWT-based mock authentication
- Role-based access control (Admin/User)
- Protected routes based on user roles
- Session persistence using localStorage

### Car Management

- **Search & Filter**: By category, brand, transmission, fuel type, price range
- **Sorting**: Price (asc/desc), rating, newest
- **Car Details**: Complete specifications, features, and availability
- **Image Gallery**: Carousel for multiple car images

### Booking System

- **Date Selection**: Pickup and return date/time picker
- **Cost Calculation**: Automatic calculation based on rental duration
- **Booking Status**: Pending, Approved, Rejected, Completed, Cancelled
- **Admin Approval**: Required for all bookings
- **Cancellation**: Users can cancel pending bookings

### Admin Dashboard

- **Statistics**: Total cars, bookings, pending approvals, revenue
- **Quick Actions**: Add car, manage bookings, view inventory
- **Booking Management**: Approve/reject with reason
- **Car Inventory**: View, edit, delete, toggle availability

## 📊 Data Models

### Car

```typescript
{
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: "sedan" | "suv" | "hatchback" | "luxury" | "sports" | "electric";
  transmission: "automatic" | "manual";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  seatingCapacity: number;
  pricePerDay: number;
  images: string[];
  features: string[];
  isAvailable: boolean;
  // ... more fields
}
```

### Booking

```typescript
{
  id: string;
  userId: string;
  carId: string;
  pickupDateTime: string;
  returnDateTime: string;
  numberOfDays: number;
  totalCost: number;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  // ... more fields
}
```

## 🔄 User Flows

### User Journey

1. Browse available cars on homepage or car listing page
2. Filter/search for specific cars
3. View detailed car information
4. Click "Book Now" (login required)
5. Fill booking form with dates and locations
6. Submit booking (status: pending)
7. Wait for admin approval
8. View booking status in "My Bookings"
9. Cancel if needed (pending bookings only)

### Admin Journey

1. Login with admin credentials
2. View dashboard statistics
3. Manage car inventory (add/edit/delete/toggle)
4. Review pending bookings
5. Approve or reject with reason
6. Track total bookings and revenue

## 🎨 Design System

### Colors

- **Primary**: Blue (#2563eb) - CTAs, links, primary actions
- **Success**: Green - Approved status, positive actions
- **Warning**: Yellow - Pending status
- **Destructive**: Red - Rejected/cancelled status, delete actions

### Components

- Fully responsive design (mobile-first)
- Consistent shadcn/ui component library
- Loading states for async operations
- Error handling with user-friendly messages
- Form validation with clear error messages

## 🚧 Current Limitations (Phase 1)

- Data stored in localStorage (not persistent across browsers)
- No real backend API
- No email notifications
- No payment integration
- No user profile editing
- No car edit form (delete/toggle only)
- No add car form (placeholder)

## 🔮 Future Enhancements (Phase 2)

### Backend Integration

- [ ] Build REST API with Node.js + Express
- [ ] Setup database (MongoDB/PostgreSQL)
- [ ] Replace localStorage with API calls
- [ ] Implement JWT authentication
- [ ] Email notifications (Nodemailer)

### Additional Features

- [ ] Payment integration (Stripe/PayPal)
- [ ] User profile management
- [ ] Car reviews and ratings
- [ ] Real-time notifications (Socket.io)
- [ ] PDF booking confirmations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile app (React Native)

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production

# Lint
npm run lint         # Run ESLint

# Preview
npm run preview      # Preview production build
```

## 🐛 Known Issues

- Fast refresh warnings in context files (doesn't affect functionality)
- No actual file upload for car images (uses URLs)
- Date picker may show browser-specific UI

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Developer Notes

### Testing

- Admin: admin@carbooking.com / Admin@123
- User: user@carbooking.com / User@123
- Sample data: 20 cars included in `src/data/dummyData.json`

### Customization

- Modify `src/data/dummyData.json` to add more cars/users
- Update color scheme in Tailwind config
- Add more features to services layer
- Extend TypeScript types as needed

### Troubleshooting

- **Can't login**: Check credentials (case-sensitive)
- **No cars showing**: Check browser console, clear localStorage
- **Routing issues**: Make sure React Router is properly configured
- **Build errors**: Delete node_modules and package-lock.json, then npm install

## 🤝 Contributing

This is a demo project. Feel free to fork and modify for your own use.

## 📞 Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
# car-booking-app
