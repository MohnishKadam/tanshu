const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Mock database for appointments
let appointments = [];

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Get all available slots for a given date
app.get('/api/appointments/available-slots/:date', (req, res) => {
  try {
    const { date } = req.params;
    console.log(`Fetching available slots for date: ${date}`);
    
    // Find appointments for the requested date
    const bookedAppointments = appointments.filter(apt => apt.date === date);
    const bookedTimes = bookedAppointments.map(appointment => appointment.time);
    
    // Generate all possible time slots (9am to 5pm, every 30 minutes)
    const allTimeSlots = [];
    const startHour = 9; // 9am
    const endHour = 17; // 5pm
    
    for (let hour = startHour; hour < endHour; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      allTimeSlots.push(`${formattedHour}:00`);
      allTimeSlots.push(`${formattedHour}:30`);
    }
    
    // Filter out the booked times
    const availableSlots = allTimeSlots.filter(time => !bookedTimes.includes(time));
    
    console.log(`Returning ${availableSlots.length} available slots`);
    res.json({ availableSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book an appointment
app.post('/api/appointments/book', (req, res) => {
  try {
    console.log('Booking request received:', req.body);
    const { name, email, date, time, purpose, notes } = req.body;

    // Validate input
    if (!name || !email || !date || !time) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide name, email, date and time.' 
      });
    }

    // Check if slot is available
    const isSlotBooked = appointments.some(apt => 
      apt.date === date && apt.time === time
    );

    if (isSlotBooked) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = {
      id: Date.now().toString(),
      name,
      email,
      date,
      time,
      purpose: purpose || 'Not specified',
      notes: notes || '',
      status: 'booked',
      createdAt: new Date().toISOString()
    };

    // Save appointment
    appointments.push(appointment);
    console.log('Appointment booked successfully:', appointment.id);

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all appointments or filter by email
app.get('/api/appointments', (req, res) => {
  try {
    const { email } = req.query;
    console.log('Getting appointments', email ? `for email: ${email}` : 'for all users');
    
    let userAppointments = appointments;
    if (email) {
      userAppointments = appointments.filter(apt => apt.email === email);
    }
    
    res.json(userAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Available slots endpoint: http://localhost:${PORT}/api/appointments/available-slots/YYYY-MM-DD`);
  console.log(`Book appointment endpoint: http://localhost:${PORT}/api/appointments/book`);
}); 