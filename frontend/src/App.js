import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import { AppointmentBooking } from './components/AppointmentBooking';
import AppointmentList from './components/AppointmentList';
import FAQ from './components/FAQ';

// Home Page Component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        {/* Hero section */}
        <div className="relative bg-indigo-600 pb-32">
          <div className="absolute inset-0">
            <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Appointment booking"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-purple-900 mix-blend-multiply" aria-hidden="true" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Appointment Booking Made Simple
            </h1>
            <p className="mt-6 max-w-3xl text-xl text-indigo-100">
              Book your appointments easily and manage them all in one place with our intuitive booking system.
            </p>
            <div className="mt-10 flex space-x-4">
              <a
                href="/book"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-indigo-700"
              >
                Book Now
              </a>
              <a
                href="/appointments"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 focus:ring-offset-indigo-700"
              >
                View Appointments
              </a>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="relative -mt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Easy Scheduling</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Book appointments with just a few clicks. Choose your preferred date and time slots.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Reminders</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Get timely notifications about your upcoming appointments. Never miss an important meeting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <h3 className="text-lg font-medium text-gray-900">Easy Rescheduling</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Need to change your appointment? Reschedule with a few clicks without any hassle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/book" component={AppointmentBooking} />
            <Route exact path="/appointments" component={AppointmentList} />
            <Route exact path="/faq" component={FAQ} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;