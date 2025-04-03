const express = require('express');
const router = express.Router();
// Remove the auth middleware import
// const { authenticate } = require('../middleware/authMiddleware');
const Appointment = require('../models/Appointment');

// Get all available slots for a given date
router.get('/available-slots/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Logic to calculate available time slots based on existing appointments
    const bookedAppointments = await Appointment.find({ date });
    const bookedTimes = bookedAppointments.map(appointment => appointment.time);
    
    // Generate all possible time slots (9am to 5pm, every 30 minutes)
    const allTimeSlots = [];
    const startHour = 9; // 9am
    const endHour = 17; // 5pm
    
    for (let hour = startHour; hour < endHour; hour++) {
      allTimeSlots.push(`${hour}:00`);
      allTimeSlots.push(`${hour}:30`);
    }
    
    // Filter out the booked times
    const availableSlots = allTimeSlots.filter(time => !bookedTimes.includes(time));
    
    res.json({ availableSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointments for the logged-in user - removed authentication middleware
router.get('/my-appointments', async (req, res) => {
  try {
    // Get email from query param instead of user object
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

// Cancel an appointment - removed authentication middleware
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
    
    await appointment.remove();
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 