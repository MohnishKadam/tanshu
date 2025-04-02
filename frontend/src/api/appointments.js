import api from './config';

// Mock data for appointments - used if the actual API is not working
const MOCK_APPOINTMENTS = [
  {
    id: '1',
    date: '2023-04-20',
    time: '10:00 AM',
    service: 'consultation',
    notes: 'First time appointment',
    status: 'confirmed'
  },
  {
    id: '2',
    date: '2023-04-25',
    time: '2:30 PM',
    service: 'follow-up',
    notes: 'Follow up on previous consultation',
    status: 'confirmed'
  },
  {
    id: '3',
    date: '2023-04-15',
    time: '11:00 AM',
    service: 'emergency',
    notes: '',
    status: 'cancelled'
  }
];

// Mock time slots
const MOCK_TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', 
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM'
];

export const fetchAppointments = async () => {
  try {
    // Try to use the actual API first
    const response = await api.get('/appointments');
    return response.data;
  } catch (error) {
    console.log('Using mock data for appointments:', error);
    // Fall back to mock data if API fails
    return MOCK_APPOINTMENTS;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    // Try to use the actual API first
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  } catch (error) {
    console.log('Using mock data for creating appointment:', error);
    // Fall back to mock data if API fails
    const newAppointment = {
      ...appointmentData,
      id: Date.now().toString(),
      status: 'confirmed',
    };
    MOCK_APPOINTMENTS.push(newAppointment);
    return newAppointment;
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    // Try to use the actual API first
    const response = await api.patch(`/appointments/${appointmentId}/cancel`);
    return response.data;
  } catch (error) {
    console.log('Using mock data for canceling appointment:', error);
    // Fall back to mock data if API fails
    const appointment = MOCK_APPOINTMENTS.find(app => app.id === appointmentId);
    if (appointment) {
      appointment.status = 'cancelled';
      return appointment;
    }
    throw new Error('Appointment not found');
  }
};

export const getAvailableSlots = async (date) => {
  try {
    // Try to use the actual API first
    const response = await api.get(`/appointments/available-slots?date=${date}`);
    return response.data;
  } catch (error) {
    console.log('Using mock data for available slots:', error);
    // Fall back to mock data if API fails
    // Filter out times that are already booked for the selected date
    const bookedTimes = MOCK_APPOINTMENTS
      .filter(app => app.date === date && app.status === 'confirmed')
      .map(app => app.time);
    
    // Return available time slots (excluding the booked ones)
    return MOCK_TIME_SLOTS.filter(time => !bookedTimes.includes(time));
  }
}; 