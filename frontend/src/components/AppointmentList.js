import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import emailjs from "@emailjs/browser";

function AppointmentList() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelToken, setCancelToken] = useState('');

  useEffect(() => {
    // Initialize EmailJS
    emailjs.init("eTO5gmqMPncxTr98F");
    
    // Check for cancel token in URL
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const cancelEmail = queryParams.get('email');
    
    if (token && cancelEmail) {
      setCancelToken(token);
      setEmail(cancelEmail);
      setSubmitted(true);
      fetchAppointments(cancelEmail);
    }
  }, []);

  const fetchAppointments = async (emailToFetch) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulating API call since we're using EmailJS
      // In a real app, this would be an API call to your backend
      setTimeout(() => {
        // Generate mock appointments data
        const mockAppointments = [
          {
            _id: '1',
            date: new Date().setDate(new Date().getDate() + 3),
            time: '10:00',
            service: 'Consultation',
            notes: 'Initial discussion about project requirements',
            cancellationToken: '123456'
          },
          {
            _id: '2',
            date: new Date().setDate(new Date().getDate() + 7),
            time: '14:30',
            service: 'Follow-up',
            notes: 'Follow up on previous discussion',
            cancellationToken: '654321'
          }
        ];
        
        setAppointments(mockAppointments);
        setLoading(false);
        
        // If there's a cancel token, find the matching appointment
        if (cancelToken) {
          const appointmentToCancel = mockAppointments.find(
            app => app.cancellationToken === cancelToken
          );
          
          if (appointmentToCancel) {
            setAppointmentToCancel(appointmentToCancel);
            setShowConfirmModal(true);
          } else {
            setError("Invalid cancellation link. Please check your email or enter your email below to view appointments.");
          }
        }
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch appointments. Please try again.');
      console.error('Error fetching appointments:', err);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      fetchAppointments(email);
    }
  };

  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowConfirmModal(true);
  };

  const confirmCancel = () => {
    if (appointmentToCancel) {
      setLoading(true);
      
      // Simulate API call to cancel appointment
      setTimeout(() => {
        // Remove the appointment from the list
        setAppointments(
          appointments.filter(app => app._id !== appointmentToCancel._id)
        );
        
        // Send cancellation email
        const templateParams = {
          to_email: email,
          user_name: "User",
          appointment_date: formatDate(appointmentToCancel.date),
          appointment_time: appointmentToCancel.time
        };
        
        emailjs
          .send("service_k1w5xhf", "template_st6y1uo", templateParams)
          .then(() => {
            setCancelSuccess(true);
            setLoading(false);
            
            // Hide success message after 3 seconds
            setTimeout(() => {
              setCancelSuccess(false);
              setShowConfirmModal(false);
              setAppointmentToCancel(null);
            }, 3000);
          })
          .catch((error) => {
            setError('Cancellation email failed to send, but appointment was cancelled.');
            setShowConfirmModal(false);
            setLoading(false);
          });
      }, 1000);
    }
  };

  const handleReschedule = (appointment) => {
    // Store appointment details in localStorage for pre-filling the booking form
    localStorage.setItem('reschedule', JSON.stringify({
      appointmentId: appointment._id,
      email: email,
      purpose: appointment.service
    }));
    
    // Redirect to booking page
    window.location.href = '/book?reschedule=true';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getServiceIcon = (serviceId) => {
    switch(serviceId) {
      case 'Consultation':
        return (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case 'Follow-up':
        return (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  if (!submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              View Your Appointments
            </h2>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Enter your email to see your scheduled appointments
            </p>
          </div>

          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Appointments
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your Appointments
          </h2>
          <p className="mt-3 text-gray-500">
            Manage your upcoming appointments with ease
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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

        {loading ? (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600">Loading your appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">
              You can cancel or reschedule any appointment up to 24 hours before the scheduled time.
            </p>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-md text-indigo-700">
                      {getServiceIcon(appointment.service)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{appointment.service}</h3>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleReschedule(appointment)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancelClick(appointment)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="mb-1">
                          <span className="font-medium">Date:</span> {formatDate(appointment.date)}
                        </div>
                        <div className="mb-1">
                          <span className="font-medium">Time:</span> {appointment.time}
                        </div>
                        {appointment.notes && (
                          <div className="mt-2 italic">
                            "{appointment.notes}"
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-xs text-gray-400">
                        Share this appointment by sending them an email or calendar invite.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md p-8 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments found</h3>
            <p className="mt-2 text-sm text-gray-500">
              You don't have any scheduled appointments at the moment.
            </p>
            <div className="mt-6">
              <Link
                to="/book"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Book an appointment
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              {cancelSuccess ? (
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Appointment Cancelled
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Your appointment has been successfully cancelled. A confirmation email has been sent.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cancel Appointment
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel your appointment on {appointmentToCancel && formatDate(appointmentToCancel.date)} at {appointmentToCancel && appointmentToCancel.time}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                      onClick={confirmCancel}
                      disabled={loading}
                    >
                      {loading ? 'Cancelling...' : 'Cancel Appointment'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:text-sm"
                      onClick={() => setShowConfirmModal(false)}
                      disabled={loading}
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { AppointmentList };
export default AppointmentList; 