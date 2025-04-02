import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { createAppointment, fetchAvailableSlots } from '../store/slices/appointmentSlice';
import { useHistory } from 'react-router-dom';

function AppointmentBooking() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { availableSlots, loading, error } = useSelector((state) => state.appointments);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    service: '',
    notes: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (formData.date) {
      dispatch(fetchAvailableSlots(formData.date));
    }
  }, [dispatch, formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createAppointment(formData)).unwrap();
      setSuccess(true);
      setTimeout(() => {
        history.push('/appointments');
      }, 2000);
    } catch (err) {
      console.error('Failed to create appointment:', err);
    }
  };

  const services = [
    { id: 'consultation', name: 'Initial Consultation', description: 'First-time appointment with our specialists' },
    { id: 'follow-up', name: 'Follow-up Visit', description: 'Check on your progress and adjust treatment' },
    { id: 'emergency', name: 'Emergency Care', description: 'Urgent care for immediate concerns' },
    { id: 'routine', name: 'Routine Checkup', description: 'Regular health monitoring and wellness check' }
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Appointment Booked!</h3>
          <p className="mt-2 text-sm text-gray-500">
            Your appointment has been successfully scheduled. Redirecting you to your appointments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Book Your Appointment
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Select your preferred date, time, and service
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <div className="mt-1">
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    disabled={!formData.date || loading}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select a time</option>
                    {availableSlots && availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))
                    ) : formData.date ? (
                      <option value="" disabled>
                        {loading ? 'Loading available times...' : 'No available slots for this date'}
                      </option>
                    ) : (
                      <option value="" disabled>
                        Please select a date first
                      </option>
                    )}
                  </select>
                </div>
                {formData.date && availableSlots && availableSlots.length === 0 && !loading && (
                  <p className="mt-2 text-sm text-red-600">No available slots for this date. Please select another date.</p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                  Service
                </label>
                <div className="mt-2 grid grid-cols-1 gap-y-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`relative rounded-lg border border-gray-300 bg-white px-5 py-4 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 ${
                        formData.service === service.id ? 'border-indigo-500 ring-2 ring-indigo-500' : ''
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, service: service.id }))}
                    >
                      <div className="flex-shrink-0">
                        <input
                          type="radio"
                          name="service"
                          value={service.id}
                          checked={formData.service === service.id}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label htmlFor={`service-${service.id}`} className="block text-sm font-medium text-gray-700">
                          {service.name}
                        </label>
                        <p className="text-xs text-gray-500 truncate">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requests or information we should know"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Brief description of your appointment needs (optional).</p>
              </div>
            </div>

            {error && (
              <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => history.push('/')}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.date || !formData.time || !formData.service}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AppointmentBooking;
