# EazyTourist Frontend

A modern React + TypeScript frontend for the EazyTourist travel application, featuring user authentication, flight search, and ```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
    configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization","Content-Type"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```ment.

## Features

- **User Authentication**: Login and registration with JWT token management
- **Flight Search**: Search flights by origin, destination, and date with autocomplete
- **Flight Booking**: Book flights with seat selection and payment processing
- **Booking Management**: View and manage personal flight reservations
- **Flight Management**: Airlines can add, edit, and delete flights  
- **Admin Panel**: System administrators can create airline and admin accounts
- **Responsive Design**: Beautiful UI with modern CSS styling and animations
- **Role-based Access**: Different features for users, airlines, and administrators

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Axios** for API communication
- **React Router DOM** for navigation
- **CSS3** with modern styling and animations

## Backend Services

This frontend connects to the following backend services:

- **User Service**: `http://localhost:8080` - User authentication and management
- **Flight Service**: `http://localhost:8081` - Flight data and booking management
- **Booking Service**: `http://localhost:8082` - Flight booking and reservation management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend services running on ports 8080, 8081, and 8082

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd EazyTouristFrontend
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

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/           # React components
│   ├── Auth.css         # Authentication styling
│   ├── Dashboard.css    # Dashboard styling
│   ├── Dashboard.tsx    # Main dashboard
│   ├── FlightComponents.css  # Flight components styling
│   ├── FlightList.tsx   # Flight search results
│   ├── FlightManagement.tsx  # Airline flight management
│   ├── FlightSearch.tsx # Flight search form
│   ├── Login.tsx        # Login component
│   └── Register.tsx     # Registration component
├── services/            # API services
│   ├── authService.ts   # Authentication API calls
│   └── flightService.ts # Flight API calls
├── App.tsx              # Main app component
├── App.css              # Global app styling
├── index.css            # Global CSS
└── main.tsx             # App entry point
```

## API Integration

### Authentication Endpoints (Port 8080)
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /users/internal/create` - Create admin/airline accounts

### Flight Endpoints (Port 8081)
- `GET /flights` - Get all flights
- `GET /flights/search` - Search flights by origin and destination
- `POST /flights` - Add flight (Airline only)
- `PUT /flights/{id}` - Update flight (Airline only)
- `DELETE /flights/{id}` - Delete flight (Airline only)
- `PATCH /flights/{id}/seats` - Update available seats (Airline only)

## Features by User Role

### Regular Users
- Register and login
- Search for flights by origin, destination, and date
- View flight details and availability
- Browse all available flights

### Airline Users
- All user features plus:
- Add new flights to the system
- Edit existing flight information
- Delete flights
- Manage seat availability
- View flight management dashboard

## Styling Features

- **Modern Design**: Clean, professional interface with gradients and shadows
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects and transitions for better UX
- **Color Scheme**: Professional blue and purple gradients
- **Typography**: Clean, readable fonts with proper hierarchy

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Clean, modular CSS with component-specific styling
- Consistent naming conventions
- Proper error handling and loading states

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend services have CORS configured for `http://localhost:5173`
2. **API Connection**: Verify backend services are running on correct ports (8080, 8081)
3. **Authentication**: Check JWT token storage in localStorage
4. **Node Version**: Ensure you're using Node.js v16 or higher

### Backend Configuration

Make sure your Spring Boot applications have the following CORS configuration:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:5173"));
    configuration.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization","Content-Type"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

## User Roles and Workflow

### User Roles

1. **USER**: Regular customers who can search and view flights
2. **AIRLINE**: Airline companies who can manage their flight schedules
3. **ADMIN**: System administrators who can create airline and admin accounts

### Getting Airline Access

**Important:** AIRLINE accounts can only be created by system administrators for security and business reasons.

**For Regular Users:**
- Public registration only creates USER accounts
- USER accounts can search flights, make bookings, and manage reservations

**For Airline Companies:**
- Contact a system administrator to request an AIRLINE account
- Provide business verification and necessary documentation
- Administrator will create the AIRLINE account through the Admin Panel

**Access Levels:**
1. **USER**: Search flights, make bookings, view personal reservations
2. **AIRLINE**: All USER features + manage flight schedules, add/edit/delete flights  
3. **ADMIN**: All features + create AIRLINE and ADMIN accounts

### Admin Account Creation

Admin accounts can only be created by existing administrators through the Admin Panel:

1. Login with an admin account
2. Navigate to Admin Panel
3. Select "ADMIN" role when creating the account
4. The new admin will receive login credentials

### Flight Booking Workflow

1. **Search Flights**: Use the search form to find available flights
2. **Select Flight**: Click "Book Now" on your preferred flight
3. **Choose Seats**: Select the number of seats in the booking modal
4. **Confirm Booking**: Review details and confirm your reservation
5. **View Bookings**: Access "My Bookings" to view all your reservations

### Flight Management Workflow

**For AIRLINE Users Only:**

1. **Account Creation**: Contact administrator to create AIRLINE account
2. **Login**: Use AIRLINE credentials to access the dashboard
3. **Access Management**: Navigate to "Manage Flights" (visible only to AIRLINE/ADMIN users)
4. **Flight Operations**: Add flight details including routes, timing, and pricing
5. **Update/Delete**: Modify existing flights or remove outdated schedules

**Access Control:**
- Regular USER accounts cannot access flight management
- Flight management features are hidden from USER accounts in the dashboard
- Attempting to access flight management shows an access denied message with instructions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the EazyTourist travel management system.