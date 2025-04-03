const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
      type: String, // Store as YYYY-MM-DD format
      required: true,
    },
    time: {
      type: String, // Store as HH:MM format
      required: true,
    },
    purpose: {
      type: String,
      default: 'Not specified',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'booked', 'cancelled'],
      default: 'booked',
    },
  },
  {
    timestamps: true,
  }
);

// Static method to check if a slot is available
appointmentSchema.statics.isSlotAvailable = async function(date, time) {
  const existingAppointment = await this.findOne({
    date,
    time,
    status: { $ne: 'cancelled' },
  });
  return !existingAppointment;
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 