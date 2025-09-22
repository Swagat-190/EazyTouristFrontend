# EazyTourist Frontend# React + TypeScript + Vite



A modern, responsive React application for flight booking and travel management, built with TypeScript and featuring a beautiful, animated UI.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## 🚀 FeaturesCurrently, two official plugins are available:



### Authentication- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

- **User Registration** - Create new accounts with email and password- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **User Login** - Secure authentication with JWT tokens

- **Auto-login** - Persistent sessions using localStorage## Expanding the ESLint configuration



### Flight ManagementIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- **Flight Search** - Search flights by origin and destination

- **Flight Booking** - View available flights with detailed information```js

- **Flight Management** - Add, edit, and delete flights (for airline users)export default defineConfig([

- **Real-time Updates** - Dynamic seat availability and pricing  globalIgnores(['dist']),

  {

### User Interface    files: ['**/*.{ts,tsx}'],

- **Modern Design** - Gradient backgrounds and smooth animations    extends: [

- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile      // Other configs...

- **Interactive Elements** - Hover effects, loading states, and transitions

- **Flight-themed Icons** - Airplane emojis and travel-related graphics      // Remove tseslint.configs.recommended and replace with this

      tseslint.configs.recommendedTypeChecked,

## 🛠 Technology Stack      // Alternatively, use this for stricter rules

      tseslint.configs.strictTypeChecked,

- **Frontend Framework**: React 18 with TypeScript      // Optionally, add this for stylistic rules

- **Build Tool**: Vite      tseslint.configs.stylisticTypeChecked,

- **Styling**: Custom CSS with gradients and animations

- **HTTP Client**: Axios for API communication      // Other configs...

- **Authentication**: JWT token-based authentication    ],

- **Navigation**: Component-based routing system    languageOptions: {

      parserOptions: {

## 📋 Prerequisites        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

Before running this application, make sure you have:      },

      // other options...

- Node.js (version 20.19+ or 22.12+)    },

- npm or yarn package manager  },

- The Spring Boot backend running on `http://localhost:8080`])

```

## ⚙️ Installation & Setup

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

1. **Navigate to the project directory**

   ```bash```js

   cd EazyTouristFrontend// eslint.config.js

   ```import reactX from 'eslint-plugin-react-x'

import reactDom from 'eslint-plugin-react-dom'

2. **Install dependencies**

   ```bashexport default defineConfig([

   npm install  globalIgnores(['dist']),

   ```  {

    files: ['**/*.{ts,tsx}'],

3. **Start the development server**    extends: [

   ```bash      // Other configs...

   npm run dev      // Enable lint rules for React

   ```      reactX.configs['recommended-typescript'],

      // Enable lint rules for React DOM

4. **Open your browser**      reactDom.configs.recommended,

   - Navigate to `http://localhost:5173`    ],

   - The application should be running!    languageOptions: {

      parserOptions: {

## 🎯 Backend Integration        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

This frontend connects to your Spring Boot TravelMate backend. Required endpoints:      },

      // other options...

### Authentication Endpoints    },

- `POST /users/register` - User registration  },

- `POST /users/login` - User login])

```

### Flight Endpoints  
- `GET /flights` - Get all flights
- `GET /flights/search?source={source}&destination={destination}` - Search flights
- `POST /flights` - Add new flight (AIRLINE role)
- `PUT /flights/{id}` - Update flight (AIRLINE role)
- `PATCH /flights/{id}/seats?seats={seats}` - Update seats (AIRLINE role)
- `DELETE /flights/{id}` - Delete flight (AIRLINE role)

## 🔐 User Roles

- **USER**: Can search and view flights
- **AIRLINE**: Can manage flights (add, edit, delete) + user features

## 📱 Application Structure

```
src/
├── components/
│   ├── Login.tsx              # User login form
│   ├── Register.tsx           # User registration form  
│   ├── Dashboard.tsx          # Main dashboard with navigation
│   ├── FlightSearch.tsx       # Flight search and listing
│   ├── FlightManagement.tsx   # Flight management for airlines
│   └── *.css                  # Component-specific styling
├── services/
│   ├── authService.ts         # Authentication API calls
│   └── flightService.ts       # Flight-related API calls
└── App.tsx                    # Main application component
```

## 🎨 Design Features

### Stunning Visual Design
- **Purple-Blue Gradients** - Modern color scheme throughout
- **Floating Animations** - Flight icons with smooth motion
- **Glass Morphism** - Transparent cards with backdrop blur
- **Hover Effects** - Interactive elements that respond to user action
- **Responsive Grid** - Adapts beautifully to any screen size

### Flight-Themed Elements
- ✈️ **Airplane Icons** - Animated flight symbols
- 🌍 **Travel Colors** - Sky blues and sunset purples
- 📊 **Data Visualization** - Clear flight information display
- 🎯 **Intuitive Navigation** - Easy-to-use interface

## 🚦 How to Use

### For All Users
1. **Register/Login** - Create account or sign in
2. **Dashboard** - Access all features from the main dashboard

### For Regular Users (USER role)
1. **Search Flights** - Use the "Search Flights" tab
2. **Filter Results** - Select origin and destination cities
3. **View Details** - See prices, times, and seat availability
4. **Select Flights** - Choose your preferred option

### For Airline Partners (AIRLINE role)  
1. **Manage Flights** - Access the "Manage Flights" tab
2. **Add Flights** - Click "Add New Flight" button
3. **Edit Flights** - Modify existing flight details
4. **Update Seats** - Change seat availability in real-time
5. **Delete Flights** - Remove flights with confirmation

## 🔧 Configuration

### API Configuration
Update the backend URL in service files if needed:
```typescript
const API_BASE_URL = 'http://localhost:8080';
```

### CORS Setup (Backend)
Ensure your Spring Boot backend allows frontend requests:
```java
configuration.setAllowedOrigins(List.of("http://localhost:5173"));
```

## 🐛 Troubleshooting

### Common Issues
1. **Backend Connection** - Ensure Spring Boot runs on port 8080
2. **Authentication** - Check JWT token configuration  
3. **CORS Errors** - Verify CORS settings in backend
4. **Node Version** - Use Node.js 20.19+ or 22.12+

### Debug Tips
- Check browser DevTools Network tab
- Inspect Console for JavaScript errors
- Verify backend server logs

## ✨ What's Special About This Frontend

1. **Beautiful Animations** - Every interaction feels smooth and polished
2. **Mobile-First Design** - Works perfectly on phones, tablets, and desktops
3. **Type Safety** - Full TypeScript implementation prevents runtime errors
4. **Modern Architecture** - Clean component structure and service organization
5. **User Experience** - Intuitive interface with clear visual feedback
6. **Performance** - Optimized with Vite for fast development and production builds

## 📈 Future Enhancements

- 🎫 **Complete Booking Flow** with payment integration
- 👤 **User Profiles** and travel history
- 🏨 **Hotel Booking** integration
- 📱 **Mobile App** version
- 🔔 **Real-time Notifications** for flight updates
- 🗺️ **Trip Planning** tools

## 🎉 Success! 

Your EazyTourist frontend is now ready! The application features:

✅ **Complete Authentication System**  
✅ **Advanced Flight Search & Management**  
✅ **Beautiful, Responsive Design**  
✅ **Smooth Animations & Interactions**  
✅ **Full TypeScript Support**  
✅ **Production-Ready Code**  

---

**Happy Traveling with EazyTourist! ✈️🌍**

*Ready to explore the world? Your journey starts here!*#   E a z y T o u r i s t F r o n t e n d  
 