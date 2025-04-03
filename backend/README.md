# Appointment Booking Backend

This is a simple backend server for the appointment booking system. It provides API endpoints for fetching available slots and booking appointments.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Run the server:
   ```
   npm run dev
   ```

The server will start on http://localhost:5000

## API Endpoints

### Get Available Slots
- **URL**: `/api/appointments/available-slots/:date`
- **Method**: `GET`
- **URL Params**: `date=[ISO date string]` (YYYY-MM-DD format)
- **Response**: Array of available time slots for the specified date

### Book Appointment
- **URL**: `/api/appointments/book`
- **Method**: `POST`
- **Data Params**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "date": "2023-06-15",
    "time": "10:00",
    "purpose": "Consultation",
    "notes": "Optional notes"
  }
  ```
- **Response**: The created appointment object

### Get User Appointments
- **URL**: `/api/appointments`
- **Method**: `GET`
- **Query Params**: `email=[user email]` (optional)
- **Response**: Array of appointments

## Notes

This is a simple in-memory implementation with no database. All data will be lost when the server restarts. For production, you should implement a proper database. 