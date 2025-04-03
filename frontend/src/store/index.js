import { configureStore } from '@reduxjs/toolkit';
import appointmentReducer from './slices/appointmentSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    auth: authReducer
  }
}); 