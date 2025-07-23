import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginRequest, RegisterRequest } from '../../types/index.js';
import authService from '../../services/auth.service';

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (!response.success) {
        return rejectWithValue(response.error || 'Login failed');
      }
      return response; // Return the whole response object
    } catch (error) {
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      if (!response.success) {
        return rejectWithValue(response.error || 'Registration failed');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch user data');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch user data. Please login again.');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Clear localStorage
      localStorage.removeItem('token');
      // Reset state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.error = null;
      // action.payload is the whole response, data is in action.payload.data
      const authData = action.payload.data;
      state.user = authData.user;
      state.token = authData.token;
      // Store token in localStorage
      if (authData.token) {
        localStorage.setItem('token', authData.token);
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
<<<<<<< HEAD
    builder.addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.error = null;
      // action.payload is the whole response, data is in action.payload.data
      const authData = action.payload.data;
      state.user = authData.user;
      state.token = authData.token;
      // Store token in localStorage
      if (authData.token) {
        localStorage.setItem('token', authData.token);
      }
=======
    builder.addCase(register.fulfilled, (state) => {
      state.isLoading = false;
      // Do NOT automatically log in user after registration
      // User should be redirected to login page instead
      state.error = null;
      // Clear any existing auth state
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
>>>>>>> 7480609 (tasarımsal düzeltmeler)
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get current user
    builder.addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload ? action.payload : null;
    });
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
