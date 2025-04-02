# Appointment Booking System

A full-stack application for managing appointments with user authentication.

## Features

- User authentication (login/register)
- Appointment booking
- View and manage appointments
- Available time slot selection
- Protected routes
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (for the backend)

## Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account or login with existing credentials
3. Book appointments by selecting a date and time slot
4. View and manage your appointments in the appointments page

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Appointments
- GET `/api/appointments` - Get all appointments
- POST `/api/appointments` - Create a new appointment
- PATCH `/api/appointments/:id/cancel` - Cancel an appointment
- GET `/api/appointments/available-slots` - Get available time slots

## Technologies Used

- Frontend:
  - React
  - Redux Toolkit
  - React Router
  - Axios
  - Tailwind CSS

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication
  - TypeScript

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 