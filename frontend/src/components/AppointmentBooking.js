import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import emailjs from "@emailjs/browser";
import axios from "axios";
import "./AppointmentBooking.css";

// Define the API URL for appointments
const API_URL = "http://localhost:5000/api/appointments";

export const AppointmentBooking = () => {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("eTO5gmqMPncxTr98F");
  }, []);

  // Fetch available time slots for selected date from the database
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setLoading(true);
      setBookingError(null);
      
      try {
        // Format date as YYYY-MM-DD for API
        const formattedDate = date.toISOString().split('T')[0];
        
        console.log(`Fetching slots for date: ${formattedDate}`);
        // Fetch available slots from the API
        const response = await axios.get(`${API_URL}/available-slots/${formattedDate}`);
        console.log("API Response:", response.data);
        
        // Convert the array of available times to the expected format
        const slots = response.data.availableSlots.map(time => ({
          time,
          available: true
        }));
        
        setAvailableTimeSlots(slots);
        setDebugInfo(null);
      } catch (error) {
        console.error("Error fetching available slots:", error);
        setDebugInfo({
          error: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        
        // If API fails or not available, generate dummy slots
        if (error.response && error.response.status === 404) {
          console.warn("Available slots endpoint not found. Generating slots.");
          generateFallbackSlots();
        } else {
          setBookingError("Failed to fetch available time slots. Please try again.");
          generateFallbackSlots();
        }
      } finally {
        setLoading(false);
      }
    };

    // Fallback function to generate time slots if API fails
    const generateFallbackSlots = () => {
      const slots = [];
      const currentDate = new Date();
      const isToday = date.toDateString() === currentDate.toDateString();
      const currentHour = currentDate.getHours();
      
      // Generate time slots from 9 AM to 5 PM
      for (let hour = 9; hour <= 17; hour++) {
        // If it's today, only show future time slots
        if (!isToday || hour > currentHour) {
          const formattedHour = hour.toString().padStart(2, '0');
          slots.push({
            time: `${formattedHour}:00`,
            available: true
          });
          slots.push({
            time: `${formattedHour}:30`,
            available: true
          });
        }
      }
      setAvailableTimeSlots(slots);
    };

    if (date) {
      fetchAvailableSlots();
    }
  }, [date]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setTime(""); // Reset time when date changes
  };

  const handleTimeSelect = (selectedTime) => {
    setTime(selectedTime);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBookingError(null);
    setDebugInfo(null);

    try {
      // Format date for API
      const formattedDate = date.toISOString().split('T')[0];
      
      const bookingData = {
        name,
        email,
        date: formattedDate,
        time,
        purpose,
        notes: ""
      };
      
      console.log("Sending booking request:", bookingData);
      
      // Book appointment via API
      const response = await axios.post(`${API_URL}/book`, bookingData);
      console.log("Booking response:", response.data);
      
      // Send email confirmation
      const templateParams = {
        to_email: "mohnish2k2@gmail.com",
        user_name: name,
        user_purpose: purpose,
        user_email: email,
        appointment_date: date.toDateString(),
        appointment_time: time,
      };

      await emailjs.send("service_k1w5xhf", "template_st6y1uo", templateParams);
      
      setBookingSuccess(true);
      // Reset form
      setName("");
      setPurpose("");
      setEmail("");
      setTime("");
    } catch (error) {
      console.error("Booking failed:", error);
      setDebugInfo({
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setBookingError(
        error.response?.data?.message || 
        "Failed to book appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const tileClassName = ({ date: tileDate }) => {
    // Highlight weekends
    return new Date(tileDate).getDay() === 0 || new Date(tileDate).getDay() === 6 
      ? 'weekend-day' 
      : null;
  };

  // Function to add events to calendar (could be expanded in the future)
  const tileContent = ({ date: tileDate }) => {
    // Show busy indicator for specific dates (this could be fetched from an API)
    const isBusy = [10, 15, 20].includes(new Date(tileDate).getDate());
    
    if (isBusy) {
      return <div className="busy-indicator"></div>;
    }
    return null;
  };

  // Generate calendar disabling past dates
  const minDate = new Date();

  if (bookingSuccess) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Appointment Booked!</h2>
          <p>Your appointment has been successfully scheduled for:</p>
          <p className="appointment-details">
            <strong>Date:</strong> {date.toDateString()}<br />
            <strong>Time:</strong> {time}
          </p>
          <p>A confirmation email has been sent to {email}</p>
          <p>You can easily cancel or reschedule this appointment by visiting the "View Appointments" page.</p>
          <div className="success-actions">
            <button onClick={() => setBookingSuccess(false)} className="button">Book Another</button>
            <a href="/appointments" className="view-link">View My Appointments</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Book an Appointment</h1>
      <p>Select a date and time that works for you.</p>
      
      {bookingError && (
        <div className="error-message">
          {bookingError}
        </div>
      )}
      
      {debugInfo && (
        <div className="debug-info" style={{background: '#f8f9fa', padding: '10px', marginBottom: '15px', fontSize: '12px'}}>
          <details>
            <summary>Debug Information</summary>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </details>
        </div>
      )}
      
      <form className="form" onSubmit={handleBooking}>
        <div className="form-grid">
          <div className="form-left">
            <Calendar
              onChange={handleDateChange}
              value={date}
              className="calendar"
              minDate={minDate}
              tileClassName={tileClassName}
              tileContent={tileContent}
            />
            
            <div className="time-slots-container">
              <h3>Available Time Slots</h3>
              {loading ? (
                <p className="loading-text">Loading available times...</p>
              ) : availableTimeSlots.length === 0 ? (
                <p className="no-slots-message">No available time slots for this date.</p>
              ) : (
                <div className="time-slots">
                  {availableTimeSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`time-slot ${slot.available ? 'available' : 'unavailable'} ${time === slot.time ? 'selected' : ''}`}
                      onClick={() => slot.available && handleTimeSelect(slot.time)}
                      disabled={!slot.available}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-right">
            <div className="input-group">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Your email for confirmation"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="purpose">Purpose of Meeting</label>
              <select
                id="purpose"
                className="input"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                <option value="Consultation">Initial Consultation</option>
                <option value="Follow-up">Follow-up Meeting</option>
                <option value="Discussion">General Discussion</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="summary-box">
              <h3>Appointment Summary</h3>
              <p><strong>Date:</strong> {date.toDateString()}</p>
              <p><strong>Time:</strong> {time || 'Not selected'}</p>
              
              <button 
                type="submit" 
                className="button" 
                disabled={!time || loading}
              >
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
