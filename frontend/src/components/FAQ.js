import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openItems, setOpenItems] = useState([0]); // First item open by default

  const toggleItem = (index) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(item => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const faqItems = [
    {
      question: "How do I book an appointment?",
      answer: "Booking an appointment is simple. Click on the 'Book Appointment' button, select your preferred date and available time slot, fill in your details, and confirm your booking."
    },
    {
      question: "Can I book an appointment without creating an account?",
      answer: "Yes! Our system allows you to book appointments as a guest, requiring only your email address so we can send you booking confirmations and reminders."
    },
    {
      question: "How can I cancel my appointment?",
      answer: "To cancel an appointment, go to the 'View Appointments' page, enter the email you used for booking, and click the 'Cancel' button next to your appointment. You can also use the cancellation link in your confirmation email."
    },
    {
      question: "How do I reschedule my appointment?",
      answer: "To reschedule, go to the 'View Appointments' page, find your appointment, and click the 'Reschedule' button. This will take you to the booking form with your details pre-filled."
    },
    {
      question: "Will I receive a confirmation after booking?",
      answer: "Yes, you'll receive an email confirmation immediately after booking with all the details of your appointment, including date, time, and a unique link to manage your appointment."
    },
    {
      question: "Will I get reminders about my upcoming appointment?",
      answer: "Yes, we'll send you a reminder email 24 hours before your scheduled appointment to ensure you don't forget."
    },
    {
      question: "How far in advance can I book an appointment?",
      answer: "You can book appointments up to 60 days in advance. This helps us maintain flexibility in our scheduling."
    },
    {
      question: "What happens if I'm late for my appointment?",
      answer: "We understand that delays can happen. If you're running late, please let us know as soon as possible. If you're more than 15 minutes late, we may need to reschedule."
    },
    {
      question: "Can I book multiple appointments?",
      answer: "Yes, you can book multiple appointments using the same email address. Each appointment will be managed separately."
    },
    {
      question: "Is there a cancellation fee?",
      answer: "There's no cancellation fee if you cancel at least 24 hours before your scheduled appointment. For late cancellations, there may be a fee."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Find answers to common questions about our appointment booking system
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {faqItems.map((item, index) => (
              <li key={index} className="px-4 py-5 sm:px-6">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex justify-between items-center text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.question}
                  </h3>
                  <span className="ml-6 flex-shrink-0">
                    {openItems.includes(index) ? (
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                </button>
                {openItems.includes(index) && (
                  <div className="mt-2 pr-12">
                    <p className="text-sm text-gray-500">
                      {item.answer}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-base text-gray-500">
            Can't find the answer you're looking for?
          </p>
          <Link to="/book" className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Book an appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 