import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import emailjs from "@emailjs/browser";
import "./AppointmentBooking.css";

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

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("eTO5gmqMPncxTr98F");
  }, []);

  // Simulate fetching available time slots for selected date
  useEffect(() => {
    const generateTimeSlots = () => {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const slots = [];
        const currentDate = new Date();
        const isToday = date.toDateString() === currentDate.toDateString();
        const currentHour = currentDate.getHours();
        
        // Generate time slots from 9 AM to 5 PM
        for (let hour = 9; hour <= 17; hour++) {
          // If it's today, only show future time slots
          if (!isToday || hour > currentHour) {
            // Randomly mark some slots as unavailable
            const isAvailable = Math.random() > 0.3;
            slots.push({
              time: `${hour}:00`,
              available: isAvailable
            });
            slots.push({
              time: `${hour}:30`,
              available: Math.random() > 0.3
            });
          }
        }
        setAvailableTimeSlots(slots);
        setLoading(false);
      }, 500);
    };

    if (date) {
      generateTimeSlots();
    }
  }, [date]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setTime(""); // Reset time when date changes
  };

  const handleTimeSelect = (selectedTime) => {
    setTime(selectedTime);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    setLoading(true);
    setBookingError(null);

    const templateParams = {
      to_email: "mohnish2k2@gmail.com",
      user_name: name,
      user_purpose: purpose,
      user_email: email,
      appointment_date: date.toDateString(),
      appointment_time: time,
    };

    console.log("Sending Email with:", templateParams);

    emailjs
      .send("service_k1w5xhf", "template_st6y1uo", templateParams)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        setBookingSuccess(true);
        setLoading(false);
        // Reset form
        setName("");
        setPurpose("");
        setEmail("");
        setTime("");
      })
      .catch((error) => {
        console.error("FAILED...", error);
        setBookingError(`Failed to book appointment: ${error.text}`);
        setLoading(false);
      });
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
