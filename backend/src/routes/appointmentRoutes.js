const express = require('express');
const router = express.Router();
// Remove the auth middleware import
// const { authenticate } = require('../middleware/authMiddleware');
const Appointment = require('../models/Appointment');

// Mock database for appointments (replace with real database in production)
let appointments = [];

// Get all available slots for a given date
router.get('/available-slots/:date', async (req, res) => {
  try {
    const { date } = req.params;
    console.log(`Fetching available slots for date: ${date}`);
    
    // Find appointments for the requested date that are not cancelled
    const bookedAppointments = await Appointment.find({ 
      date,
      status: { $ne: 'cancelled' }
    });
    
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

// Get appointments for a specific email
router.get('/my-appointments', async (req, res) => {
  try {
    // Get email from query param
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }
    
    const appointments = await Appointment.find({ email }).sort({ date: 1, time: 1 });
    
    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new appointment - removed authentication middleware
router.post('/', async (req, res) => {
  try {
    const { name, email, date, time, service, notes } = req.body;
    
    // Validate required fields
    if (!name || !email || !date || !time || !service) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if the slot is available
    const existingAppointment = await Appointment.findOne({ date, time });
    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    // Create new appointment
    const newAppointment = new Appointment({
      name,
      email,
      date,
      time,
      service,
      notes: notes || ''
    });
    
    await newAppointment.save();
    
    res.status(201).json({ appointment: newAppointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel an appointment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }
    
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Verify that the appointment belongs to the user
    if (appointment.email !== email) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Mark as cancelled instead of removing
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book an appointment
router.post('/book', async (req, res) => {
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
    const isAvailable = await Appointment.isSlotAvailable(date, time);
    if (!isAvailable) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const newAppointment = new Appointment({
      name,
      email,
      date,
      time,
      purpose: purpose || 'Not specified',
      notes: notes || '',
      status: 'booked'
    });

    // Save appointment to MongoDB
    await newAppointment.save();
    console.log('Appointment booked successfully:', newAppointment._id);

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all appointments or filter by email
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('Getting appointments', email ? `for email: ${email}` : 'for all users');
    
    let query = {};
    if (email) {
      query.email = email;
    }
    
    const appointments = await Appointment.find(query).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 