import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/appointments';

export const fetchAvailableSlots = createAsyncThunk(
  'appointments/fetchAvailableSlots',
  async (date, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/available-slots/${date}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available slots');
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create appointment');
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/my-appointments?email=${email}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancelAppointment',
  async ({ id, email }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}?email=${email}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel appointment');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    availableSlots: [],
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearAppointmentState(state) {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch available slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload.availableSlots;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch available slots';
      })
      
      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.appointments.push(action.payload.appointment);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create appointment';
        state.success = false;
      })
      
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.appointments;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch appointments';
      })
      
      // Cancel appointment
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(appointment => appointment._id !== action.payload.id);
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to cancel appointment';
      });
  }
});

export const { clearAppointmentState } = appointmentSlice.actions;

export default appointmentSlice.reducer; 