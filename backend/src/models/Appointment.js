const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for querying appointments by date and time
appointmentSchema.index({ date: 1, time: 1 });

// Virtual for checking if appointment is in the past
appointmentSchema.virtual('isPast').get(function() {
  const appointmentDateTime = new Date(`${this.date}T${this.time}`);
  return appointmentDateTime < new Date();
});

// Method to check if slot is available
appointmentSchema.statics.isSlotAvailable = async function(date, time) {
  const existingAppointment = await this.findOne({
    date,
    time,
    status: 'booked'
  });
  return !existingAppointment;
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 